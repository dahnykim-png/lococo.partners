/**
 * Shared Cloudflare Pages Function core handler for Meta access_token exchange.
 * Handles POST requests to receive Meta access_token, executes 2-step token exchange:
 * 1. User Token -> /me -> /me/permissions -> /me/accounts -> List of Pages & Page Access Tokens
 * 2. Page Token -> /{page_id}?fields=instagram_business_account -> Instagram Business Account ID
 */
export async function handleSaveToken(context) {
  const { request } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Content-Type must be application/json' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const body = await request.json();
    const rawToken = body.access_token;
    const userAccessToken = rawToken ? String(rawToken).trim() : '';

    console.log('[save-token-core] Received User Token:', {
      exists: !!userAccessToken,
      length: userAccessToken.length,
      preview: userAccessToken ? `${userAccessToken.substring(0, 15)}...${userAccessToken.substring(userAccessToken.length - 10)}` : 'EMPTY'
    });

    if (!userAccessToken) {
      return new Response(
        JSON.stringify({ success: false, error: 'access_token is required' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const stepResults = [];

    // Step 1: Query User Profile (/me)
    const targetMeUrl = `https://graph.facebook.com/v21.0/me?fields=id,name&access_token=${encodeURIComponent(userAccessToken)}`;
    const meRes = await fetch(targetMeUrl);
    const meData = await meRes.json();
    stepResults.push({ step: '1_user_profile', status: meRes.status, data: meData });

    // Step 2: Query User Permissions (/me/permissions)
    const targetPermsUrl = `https://graph.facebook.com/v21.0/me/permissions?access_token=${encodeURIComponent(userAccessToken)}`;
    const permsRes = await fetch(targetPermsUrl);
    const permsData = await permsRes.json();
    stepResults.push({ step: '2_user_permissions', status: permsRes.status, data: permsData });

    // Step 3: Fetch Pages & Page Tokens via /me/accounts
    const targetAccountsUrl = `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,access_token&access_token=${encodeURIComponent(userAccessToken)}`;
    console.log('[save-token-core] Calling /me/accounts to get Pages & Page Tokens...');
    const accountsRes = await fetch(targetAccountsUrl);
    const accountsRawText = await accountsRes.text();
    let accountsData;
    try {
      accountsData = JSON.parse(accountsRawText);
    } catch (e) {
      accountsData = { rawText: accountsRawText };
    }
    stepResults.push({ step: '3_me_accounts', status: accountsRes.status, data: accountsData });

    const pages = [];
    let targetInstagramAccount = null;

    if (accountsData && Array.isArray(accountsData.data)) {
      console.log(`[save-token-core] Found ${accountsData.data.length} page(s) in /me/accounts`);

      for (const pageItem of accountsData.data) {
        const pageId = pageItem.id;
        const pageName = pageItem.name;
        const pageToken = pageItem.access_token;

        const pageObj = {
          id: pageId,
          name: pageName,
          hasPageToken: !!pageToken,
          instagramBusinessAccount: null,
          error: null
        };

        if (pageToken) {
          // Step 4: Query Page ID with Page Access Token to get instagram_business_account
          const pageDetailUrl = `https://graph.facebook.com/v21.0/${pageId}?fields=instagram_business_account{id,username,name}&access_token=${encodeURIComponent(pageToken)}`;
          console.log(`[save-token-core] Querying Page (${pageName} / ${pageId}) with Page Token for IG Business Account...`);

          try {
            const pageRes = await fetch(pageDetailUrl);
            const pageData = await pageRes.json();
            stepResults.push({ step: `4_page_ig_account_${pageId}`, status: pageRes.status, data: pageData });

            if (pageData && pageData.instagram_business_account) {
              const igAccount = pageData.instagram_business_account;
              pageObj.instagramBusinessAccount = igAccount;

              if (!targetInstagramAccount) {
                targetInstagramAccount = {
                  id: igAccount.id,
                  username: igAccount.username || '',
                  name: igAccount.name || '',
                  linkedPageId: pageId,
                  linkedPageName: pageName,
                  pageToken: pageToken
                };
              }
            } else if (pageData.error) {
              pageObj.error = pageData.error;
            }
          } catch (pErr) {
            console.error(`[save-token-core] Error fetching IG account for page ${pageId}:`, pErr);
            pageObj.error = pErr.message;
          }
        } else {
          pageObj.error = 'No Page Access Token returned for this page';
        }

        pages.push(pageObj);
      }
    }

    console.log('[save-token-core] Execution Summary:', {
      user: meData.name || meData.id,
      pagesFound: pages.length,
      targetInstagramAccount: targetInstagramAccount ? targetInstagramAccount.id : 'NONE'
    });

    // Step 5: Save seller diagnosis record to Cloudflare D1 database (diagnosis_submissions)
    let d1Saved = false;
    let d1Error = null;

    const dbBinding = (context && context.env) ? (context.env.DB || context.env.lococo_diagnosis_db) : null;

    const igId = targetInstagramAccount ? (targetInstagramAccount.id || '') : '';
    const igUsername = targetInstagramAccount ? (targetInstagramAccount.username || targetInstagramAccount.name || '') : '';
    const pageId = targetInstagramAccount ? (targetInstagramAccount.linkedPageId || '') : '';
    const pageName = targetInstagramAccount ? (targetInstagramAccount.linkedPageName || '') : '';

    const rawJson = JSON.stringify({
      user: meData,
      targetInstagramAccount,
      pages,
      stepResults,
      rawAccountsData: accountsData,
      rawMeData: meData,
      rawPermissionsData: permsData
    });

    if (dbBinding) {
      try {
        await dbBinding.prepare(`
          CREATE TABLE IF NOT EXISTS diagnosis_submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            instagram_business_account_id TEXT,
            instagram_username TEXT,
            page_name TEXT,
            page_id TEXT,
            raw_response_json TEXT,
            submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            synced_to_core INTEGER DEFAULT 0
          )
        `).run();

        await dbBinding.prepare(`
          INSERT INTO diagnosis_submissions 
          (instagram_business_account_id, instagram_username, page_name, page_id, raw_response_json, synced_to_core)
          VALUES (?, ?, ?, ?, ?, 0)
        `).bind(
          igId,
          igUsername,
          pageName,
          pageId,
          rawJson
        ).run();

        d1Saved = true;
        console.log('[save-token-core] Saved seller diagnosis record to Cloudflare D1 diagnosis_submissions');
      } catch (dbErr) {
        console.error('[save-token-core] Error writing to Cloudflare D1:', dbErr);
        d1Error = dbErr.message;
      }
    } else {
      console.warn('[save-token-core] D1 binding missing in context.env. Logging raw JSON to prevent data loss:', rawJson.substring(0, 200));
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: targetInstagramAccount 
          ? 'Instagram Business Account successfully retrieved via Page Token' 
          : 'Pages processed, but no Instagram Business Account linked to the pages',
        user: meData,
        targetInstagramAccount,
        pages,
        stepResults,
        d1Saved,
        d1Error,
        rawAccountsData: accountsData,
        rawMeData: meData,
        rawPermissionsData: permsData
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('[save-token-core] Function error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Internal Server Error' }),
      { status: 500, headers: corsHeaders }
    );
  }
}


