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
    const { pathname } = url;
    
    // CORS headers for all responses
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
    
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    // API Routes - accessible via meadery.win/api/*
    if (pathname.startsWith('/api/')) {
      return handleApiRequest(pathname, request, corsHeaders);
    }
    
    // Root path
    if (pathname === '/') {
      return new Response('Hello World! 🌟 Your Cloudflare Worker is running on meadery.win!', {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          ...corsHeaders
        }
      });
    }
    
    // 404 for other paths
    return new Response('Not Found', { 
      status: 404,
      headers: corsHeaders
    });
  },
};

// Handle API requests
async function handleApiRequest(pathname, request, corsHeaders) {
  const method = request.method;
  
  // API endpoint: /api/hello
  if (pathname === '/api/hello') {
    const data = {
      message: 'Hello from meadery.win API!',
      timestamp: new Date().toISOString(),
      path: pathname,
      method: method,
      domain: 'meadery.win'
    };
    
    return new Response(JSON.stringify(data, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
  
  // API endpoint: /api/status
  if (pathname === '/api/status') {
    const data = {
      status: 'online',
      service: 'Cloudflare Worker',
      domain: 'meadery.win',
      timestamp: new Date().toISOString(),
      uptime: 'Always available! 🚀'
    };
    
    return new Response(JSON.stringify(data, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
  
  // API endpoint: /api/info
  if (pathname === '/api/info') {
    const data = {
      project: 'Cloudflare Project Worker',
      domain: 'meadery.win',
      endpoints: [
        '/api/hello - Get hello message',
        '/api/status - Get service status',
        '/api/info - Get API information'
      ],
      timestamp: new Date().toISOString()
    };
    
    return new Response(JSON.stringify(data, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
  
  // API 404
  return new Response(JSON.stringify({
    error: 'API endpoint not found',
    path: pathname,
    available_endpoints: ['/api/hello', '/api/status', '/api/info']
  }, null, 2), {
    status: 404,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
}