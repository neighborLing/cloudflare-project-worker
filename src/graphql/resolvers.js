// GraphQL Resolvers 实现 for Cloudflare Worker

// 模拟的聊天历史存储（在实际生产环境中可以使用Cloudflare KV或D1数据库）
let chatHistory = [];

// 调用DeepSeek AI API
async function callDeepSeekAPI(messages, model = 'deepseek-chat') {
  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-4b919b2ca56644a4a058994c78ec5d2d'
      },
      body: JSON.stringify({
        model,
        messages,
        stream: false
      })
    });
    
    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('DeepSeek API调用失败:', error);
    throw new Error(`AI API调用失败: ${error.message}`);
  }
}

export const resolvers = {
  Query: {
    // 获取聊天历史
    getChatHistory: () => {
      return chatHistory;
    },
    
    // 健康检查
    health: () => {
      return 'Cloudflare Worker GraphQL服务运行正常！🚀💘';
    },
    
    // Worker信息
    workerInfo: () => {
      return {
        name: 'cloudflare-project-worker',
        version: '1.0.0',
        domain: 'meadery.win',
        timestamp: new Date().toISOString(),
        endpoints: [
          '/api/graphql - GraphQL endpoint',
          '/api/chat - REST chat endpoint',
          '/api/hello - Hello endpoint',
          '/api/status - Status endpoint',
          '/api/info - Info endpoint'
        ]
      };
    },
  },

  Mutation: {
    // 发送聊天消息
    sendChatMessage: async (_, { input }) => {
      try {
        const { message, systemMessage = 'You are a helpful assistant.', model = 'deepseek-chat' } = input;
        
        // 创建用户消息
        const userMessage = {
          id: Date.now().toString(),
          role: 'user',
          content: message,
          timestamp: new Date().toISOString(),
        };
        
        // 添加到历史记录
        chatHistory.push(userMessage);
        
        // 准备发送给AI的消息
        const apiMessages = [
          { role: 'system', content: systemMessage },
          ...chatHistory.map(msg => ({ role: msg.role, content: msg.content })),
        ];
        
        // 调用DeepSeek API
        const aiResponse = await callDeepSeekAPI(apiMessages, model);
        
        // 创建AI回复消息
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: aiResponse.choices[0].message.content,
          timestamp: new Date().toISOString(),
        };
        
        // 添加到历史记录
        chatHistory.push(aiMessage);
        
        return {
          success: true,
          message: aiMessage,
          error: null,
        };
      } catch (error) {
        console.error('发送消息失败:', error);
        return {
          success: false,
          message: null,
          error: error.message || '未知错误',
        };
      }
    },
    
    // 清空聊天历史
    clearChatHistory: () => {
      chatHistory = [];
      return true;
    },
  },

  Subscription: {
    // 消息更新订阅（为未来的实时功能预留）
    messageAdded: {
      // 在Cloudflare Worker中实现WebSocket订阅需要额外配置
      subscribe: () => {
        // 返回异步迭代器
        // 这里可以实现基于Cloudflare Durable Objects的实时订阅
      },
    },
  },
};

export default resolvers;