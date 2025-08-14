/**
 * Cloudflare Worker with GraphQL Support
 * 
 * Features:
 * - REST API endpoints
 * - GraphQL API with Apollo integration
 * - DeepSeek AI chat functionality
 * - CORS support
 */

import { handleGraphQLRequest } from './graphql/server.js';

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
    
    // GraphQL endpoint - accessible via meadery.win/api/graphql
    if (pathname === '/api/graphql') {
      return handleGraphQLRequest(request);
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
  
  // API endpoint: /api/chat
  if (pathname === '/api/chat' && method === 'POST') {
    try {
      const requestData = await request.json();
      
      // 构建发送给DeepSeek API的请求
      const deepseekRequest = {
        model: requestData.model || "deepseek-chat",
        messages: requestData.messages || [
          {"role": "system", "content": "You are a helpful assistant."},
          {"role": "user", "content": "Hello!"}
        ],
        stream: requestData.stream !== undefined ? requestData.stream : true // 默认启用流式响应
      };
      
      // 调用DeepSeek API
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-4b919b2ca56644a4a058994c78ec5d2d'
        },
        body: JSON.stringify(deepseekRequest)
      });
      
      // 如果是流式响应，直接转发流
      if (deepseekRequest.stream) {
        return new Response(response.body, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            ...corsHeaders
          }
        });
      } else {
        // 非流式响应，返回JSON
        const result = await response.json();
        return new Response(JSON.stringify(result, null, 2), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }
      
    } catch (error) {
      return new Response(JSON.stringify({
        error: 'Failed to process chat request',
        message: error.message
      }, null, 2), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  }
  
  // API endpoint: /api/info
  if (pathname === '/api/info') {
    const data = {
      project: 'Cloudflare Project Worker with GraphQL',
      domain: 'meadery.win',
      endpoints: [
        '/api/hello - Get hello message',
        '/api/status - Get service status',
        '/api/info - Get API information',
        '/api/chat - Chat with DeepSeek AI (POST)',
        '/api/graphql - GraphQL endpoint (GET/POST)'
      ],
      features: [
        'REST API endpoints',
        'GraphQL API with Yoga',
        'DeepSeek AI integration',
        'CORS support',
        'Real-time chat capabilities'
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
    available_endpoints: ['/api/hello', '/api/status', '/api/info', '/api/chat', '/api/graphql']
  }, null, 2), {
    status: 404,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
}