export async function onRequest(context) {
  const { request, env } = context;
  return handleFetch(request, env);
}

export default {
  async fetch(request, env, ctx) {
    return handleFetch(request, env);
  }
};

async function handleFetch(request, env) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Pass API endpoints to specific handlers or static assets
  if (
    pathname.startsWith('/api/') || 
    pathname.startsWith('/save-token') || 
    pathname === '/functions/save-token'
  ) {
    if (env && env.ASSETS) return env.ASSETS.fetch(request);
    return fetch(request);
  }

  // Pass static assets with extensions (.js, .css, .svg, .mp3, etc.)
  if (pathname.includes('.') && !pathname.endsWith('.html')) {
    if (env && env.ASSETS) return env.ASSETS.fetch(request);
    return fetch(request);
  }

  // SPA Fallback: Serve /index.html with HTTP 200 OK for all page routes (/diagnosis, /success, etc.)
  try {
    const indexUrl = new URL('/index.html', request.url);
    const indexResponse = (env && env.ASSETS) ? await env.ASSETS.fetch(indexUrl) : await fetch(indexUrl);
    
    return new Response(indexResponse.body, {
      status: 200,
      headers: {
        'content-type': 'text/html;charset=UTF-8',
        'cache-control': 'public, max-age=0, must-revalidate',
      }
    });
  } catch (err) {
    if (env && env.ASSETS) return env.ASSETS.fetch(request);
    return fetch(request);
  }
}
