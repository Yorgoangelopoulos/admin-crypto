"use client"

import PortfolioStats from "@/components/portfolio-stats"
import OrderbookTrades from "@/components/orderbook-trades"
import ExploreMarket from "@/components/explore-market"
import Watchlist from "@/components/watchlist"
import MarketTrades from "@/components/market-trades"

export default function Dashboard() {
  return (
    <div className="p-4 bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PortfolioStats />
        <OrderbookTrades />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <ExploreMarket />
        <div className="grid grid-cols-1 gap-6">
          <Watchlist />
          <MarketTrades />
        </div>
      </div>
    </div>
  )
}
