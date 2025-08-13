/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Simple routing example
    if (url.pathname === '/') {
      return new Response('Hello World! 🌟 Your Cloudflare Worker is running!', {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    if (url.pathname === '/api/hello') {
      const data = {
        message: 'Hello from Cloudflare Worker!',
        timestamp: new Date().toISOString(),
        path: url.pathname
      };
      
      return new Response(JSON.stringify(data, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // 404 for other paths
    return new Response('Not Found', { status: 404 });
  },
};