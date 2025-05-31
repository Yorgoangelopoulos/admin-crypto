# Cryptocurrency Trading Dashboard

![Cryptocurrency Dashboard Interface](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-21%20at%2000.01.09-1DI8PlTigyTXyu5nPuXVjFdbqYc5Av.png)

## Features

- Real-time cryptocurrency price tracking with CoinMarketCap API
- Portfolio statistics with interactive charts
- Orderbook and trades visualization
- Market exploration with multiple cryptocurrencies
- Watchlist for tracking favorite assets
- Wallet management with transaction history
- AI-powered trading assistant

## Technologies Used

- Next.js 14 (App Router)
- Tailwind CSS
- Recharts for data visualization
- Lucide React for icons
- TypeScript
- CoinMarketCap API for real-time crypto data

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Copy `.env.local.example` to `.env.local` and add your CoinMarketCap API key
4. Run the development server with `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Setting up CoinMarketCap API

1. Sign up for a free API key at [CoinMarketCap](https://coinmarketcap.com/api/)
2. Copy your API key to the `.env.local` file:
   \`\`\`
   COINMARKETCAP_API_KEY=your_api_key_here
   \`\`\`

## Project Structure

- `/app` - Next.js app router pages
- `/components` - Reusable UI components
- `/lib` - Utility functions and API helpers
- `/public` - Static assets

## License

MIT
