// GraphQL Server for Cloudflare Worker
import { createYoga } from 'graphql-yoga';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';

// 创建GraphQL Yoga服务器实例
export const createGraphQLServer = () => {
  return createYoga({
    schema: {
      typeDefs,
      resolvers,
    },
    // Cloudflare Worker环境配置
    cors: {
      origin: '*',
      credentials: true,
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    },
    // 开发环境下启用GraphQL Playground
    graphiql: {
      title: 'Cloudflare Worker GraphQL API 🚀',
      headerEditorEnabled: true,
    },
    // 自定义上下文
    context: ({ request }) => {
      return {
        request,
        // 可以添加用户信息、环境变量等
        timestamp: new Date().toISOString(),
        worker: 'cloudflare-project-worker',
      };
    },
    // 错误处理
    maskedErrors: false, // 开发环境显示详细错误
    logging: {
      debug: (...args) => console.log('GraphQL Debug:', ...args),
      info: (...args) => console.log('GraphQL Info:', ...args),
      warn: (...args) => console.warn('GraphQL Warning:', ...args),
      error: (...args) => console.error('GraphQL Error:', ...args),
    },
  });
};

// 处理GraphQL请求的函数
export async function handleGraphQLRequest(request) {
  const yoga = createGraphQLServer();
  
  try {
    // 使用Yoga处理请求
    const response = await yoga.fetch(request);
    
    // 添加CORS头
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
    
    // 创建新的响应对象，添加CORS头
    const newResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers.entries()),
        ...corsHeaders,
      },
    });
    
    return newResponse;
  } catch (error) {
    console.error('GraphQL请求处理失败:', error);
    
    return new Response(
      JSON.stringify({
        errors: [{
          message: 'Internal server error',
          extensions: {
            code: 'INTERNAL_ERROR',
            timestamp: new Date().toISOString(),
          },
        }],
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  }
}

export default { createGraphQLServer, handleGraphQLRequest };