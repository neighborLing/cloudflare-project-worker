# Cloudflare Project Worker

A simple Cloudflare Worker project built with modern JavaScript.

## 🚀 Features

- Simple HTTP request handling
- JSON API endpoints
- CORS support
- Easy deployment with Wrangler

## 📦 Installation

```bash
npm install
```

## 🛠️ Development

Start the development server:

```bash
npm run dev
```

This will start a local server at `http://localhost:8787`

## 🌐 API Endpoints

All API endpoints are accessible via `meadery.win/api/*`:

- `GET /` - Returns a simple hello message
- `GET /api/hello` - Returns JSON response with greeting and timestamp
- `GET /api/status` - Returns service status information
- `GET /api/info` - Returns API documentation and available endpoints
- `POST /api/chat` - Chat with DeepSeek AI (requires API key configuration)
- `GET/POST /api/graphql` - GraphQL endpoint

## 🚀 Deployment

### Prerequisites
1. A Cloudflare account
2. Domain `meadery.win` added to your Cloudflare account
3. Wrangler CLI installed

### Steps
1. Install Wrangler CLI globally (if not already installed):
   ```bash
   npm install -g wrangler
   ```

2. Login to Cloudflare:
   ```bash
   wrangler login
   ```

3. Configure your `wrangler.toml`:
   - Add your `account_id`
   - Ensure `meadery.win` domain is configured in your Cloudflare account

4. Deploy to Cloudflare:
   ```bash
   npm run deploy
   ```

### Custom Domain Setup
This worker is configured to handle requests to `meadery.win/api/*`. Make sure:
- The domain `meadery.win` is added to your Cloudflare account
- DNS is properly configured
- The worker route is set up correctly

## 📁 Project Structure

```
cloudflare-project-worker/
├── src/
│   └── index.js          # Main worker script
├── package.json          # Project dependencies
├── wrangler.toml         # Cloudflare configuration
└── README.md            # Project documentation
```

## 🔧 Configuration

### Environment Variables

This project uses environment variables for secure configuration:

#### Setting up API Keys (Secrets)
```bash
# Set DeepSeek API key (required for /api/chat endpoint)
wrangler secret put DEEPSEEK_API_KEY
# Enter your API key when prompted

# List all configured secrets
wrangler secret list

# Delete a secret if needed
wrangler secret delete DEEPSEEK_API_KEY
```

#### Environment Variables in wrangler.toml
```toml
# Non-sensitive configuration
[vars]
API_BASE_URL = "https://api.deepseek.com"
DEBUG_MODE = "false"

# Different environments
[env.production.vars]
DEBUG_MODE = "false"

[env.staging.vars]
DEBUG_MODE = "true"
```

### General Configuration

Edit `wrangler.toml` to configure:
- Worker name
- Account ID
- Environment settings
- Custom domains (if needed)

## 📚 Learn More

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [Workers Examples](https://developers.cloudflare.com/workers/examples/)

## 📄 License

MIT