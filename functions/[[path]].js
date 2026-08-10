import { handleSaveToken } from './save-token-core.js';

export async function onRequest(context) {
  return handleFetch(context.request, context.env, context);
}

export default {
  async fetch(request, env, ctx) {
    return handleFetch(request, env, ctx);
  }
};

async function handleFetch(request, env, ctx) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Handle API token exchange endpoints directly
  if (
    pathname === '/api/save-token' || 
    pathname === '/save-token' || 
    pathname === '/functions/save-token' ||
    pathname.startsWith('/api/save-token') ||
    pathname.startsWith('/functions/save-token')
  ) {
    return handleSaveToken({ request, env, ctx });
  }

  // Pass static assets (.js, .css, .svg, .mp3, etc.)
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
