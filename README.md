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

- `GET /` - Returns a simple hello message
- `GET /api/hello` - Returns JSON response with timestamp

## 🚀 Deployment

1. Install Wrangler CLI globally (if not already installed):
   ```bash
   npm install -g wrangler
   ```

2. Login to Cloudflare:
   ```bash
   wrangler login
   ```

3. Configure your `wrangler.toml` with your account details

4. Deploy to Cloudflare:
   ```bash
   npm run deploy
   ```

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