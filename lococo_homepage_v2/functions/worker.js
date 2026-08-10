import { handleSaveToken } from './save-token-core.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // 1. Meta OAuth API Token Exchange endpoints
    if (
      pathname === '/api/save-token' || 
      pathname === '/save-token' || 
      pathname === '/functions/save-token' ||
      pathname.startsWith('/api/save-token') ||
      pathname.startsWith('/functions/save-token')
    ) {
      return handleSaveToken({ request, env, ctx });
    }

    // 2. Fetch static assets from ASSETS binding
    const assetResponse = await env.ASSETS.fetch(request);
    if (assetResponse.status !== 404) {
      return assetResponse;
    }

    // 3. SPA Fallback: Return /index.html with HTTP 200 OK for routes like /diagnosis, /success
    const indexUrl = new URL('/index.html', request.url);
    return env.ASSETS.fetch(indexUrl);
  }
};
