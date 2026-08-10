import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const rawAppId = env.META_APP_ID || env.VITE_META_APP_ID || '';
  const metaAppId = rawAppId.trim();

  return {
    envPrefix: ['VITE_', 'META_'],
    define: {
      'import.meta.env.VITE_META_APP_ID': JSON.stringify(metaAppId),
      'import.meta.env.META_APP_ID': JSON.stringify(metaAppId),
    },
    plugins: [
      react(),
      {
        name: 'cloudflare-functions-dev',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            const urlPath = (req.url || '').split('?')[0];
            const isSaveTokenEndpoint = [
              '/api/save-token',
              '/api/save-token.js',
              '/save-token',
              '/save-token.js',
              '/functions/save-token',
              '/functions/save-token.js'
            ].includes(urlPath);

            if (isSaveTokenEndpoint && req.method === 'POST') {
              let body = '';
              req.on('data', chunk => { body += chunk; });
              req.on('end', async () => {
                try {
                  const parsed = JSON.parse(body || '{}');
                  const rawToken = parsed.access_token;
                  const userAccessToken = rawToken ? String(rawToken).trim() : '';

                  console.log('\n[Dev Middleware /functions/save-token] Received User Token:', {
                    exists: !!userAccessToken,
                    length: userAccessToken.length,
                    preview: userAccessToken ? `${userAccessToken.substring(0, 15)}...${userAccessToken.substring(userAccessToken.length - 10)}` : 'EMPTY'
                  });

                  if (!userAccessToken) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    return res.end(JSON.stringify({ success: false, error: 'access_token is required' }));
                  }

                  const stepResults = [];

                  // Step 1: User Profile (/me)
                  const targetMeUrl = `https://graph.facebook.com/v21.0/me?fields=id,name&access_token=${encodeURIComponent(userAccessToken)}`;
                  const meRes = await fetch(targetMeUrl);
                  const meData = await meRes.json();
                  stepResults.push({ step: '1_user_profile', status: meRes.status, data: meData });

                  // Step 2: Permissions (/me/permissions)
                  const targetPermsUrl = `https://graph.facebook.com/v21.0/me/permissions?access_token=${encodeURIComponent(userAccessToken)}`;
                  const permsRes = await fetch(targetPermsUrl);
                  const permsData = await permsRes.json();
                  stepResults.push({ step: '2_user_permissions', status: permsRes.status, data: permsData });

                  // Step 3: Fetch Pages & Page Tokens via /me/accounts
                  const targetAccountsUrl = `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,access_token&access_token=${encodeURIComponent(userAccessToken)}`;
                  console.log('[Dev Middleware] Calling /me/accounts for Pages & Page Tokens...');
                  const accountsRes = await fetch(targetAccountsUrl);
                  const accountsRawText = await accountsRes.text();
                  let accountsData;
                  try { accountsData = JSON.parse(accountsRawText); } catch (e) { accountsData = { rawText: accountsRawText }; }
                  stepResults.push({ step: '3_me_accounts', status: accountsRes.status, data: accountsData });

                  const pages = [];
                  let targetInstagramAccount = null;

                  if (accountsData && Array.isArray(accountsData.data)) {
                    console.log(`[Dev Middleware] Found ${accountsData.data.length} page(s)`);

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
                        // Step 4: Query Page ID with Page Access Token
                        const pageDetailUrl = `https://graph.facebook.com/v21.0/${pageId}?fields=instagram_business_account{id,username,name}&access_token=${encodeURIComponent(pageToken)}`;
                        console.log(`[Dev Middleware] Querying Page (${pageName} / ${pageId}) with Page Token...`);

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
                          console.error(`[Dev Middleware] Error fetching IG account for page ${pageId}:`, pErr);
                          pageObj.error = pErr.message;
                        }
                      } else {
                        pageObj.error = 'No Page Access Token returned for this page';
                      }

                      pages.push(pageObj);
                    }
                  }

                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({
                    success: true,
                    message: targetInstagramAccount
                      ? 'Instagram Business Account successfully retrieved via Page Token (Dev Server)'
                      : 'Pages processed, but no Instagram Business Account linked (Dev Server)',
                    user: meData,
                    targetInstagramAccount,
                    pages,
                    stepResults,
                    rawAccountsData: accountsData,
                    rawMeData: meData,
                    rawPermissionsData: permsData
                  }));
                } catch (err) {
                  console.error('[Dev Middleware Error]:', err);
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: false, error: err.message }));
                }
              });
              return;
            }
            next();
          });
        }
      }
    ],
  }
})
