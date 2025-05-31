"use client"

import { useState, useEffect } from "react"
import { Loader2, RefreshCw } from "lucide-react"
import { fetchCryptoData } from "@/lib/api"

export default function MarketTrades() {
  const [marketTradesData, setMarketTradesData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchData()

    // Set up interval to refresh data every minute
    const intervalId = setInterval(fetchData, 60 * 1000)

    return () => clearInterval(intervalId)
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchCryptoData("cryptocurrency/listings/latest", 10)

      // Ensure data structure is correct
      if (data && data.data && Array.isArray(data.data)) {
        // Transform data to match the market trades format
        const tradesData = data.data.map((crypto: any) => ({
          symbol: crypto.symbol,
          price: crypto.quote?.USD?.price?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || "0.00",
          size: (Math.random() * 0.01).toFixed(4), // Simulated trade size
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        }))

        setMarketTradesData(tradesData)
      } else {
        throw new Error("Invalid data structure received")
      }
    } catch (err) {
      setError("Failed to fetch market trades data")
      console.error("Market trades fetch error:", err)

      // Set fallback data
      setMarketTradesData([
        {
          symbol: "BTC",
          price: "43,250.75",
          size: "0.0025",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        },
      ])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchData()
  }

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Market Trades</h2>
        <button
          onClick={handleRefresh}
          disabled={refreshing || loading}
          className="p-1 rounded-md hover:bg-muted transition-colors"
        >
          {refreshing ? (
            <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
          ) : (
            <RefreshCw className="h-5 w-5 text-muted-foreground" />
          )}
        </button>
      </div>

      {loading && marketTradesData.length === 0 ? (
        <div className="flex items-center justify-center h-[200px]">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[200px]">
          <div className="text-center">
            <p className="text-red-500 mb-2">Error loading data</p>
            <button onClick={fetchData} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-4 px-4">
          <div className="min-w-[400px]">
            <div className="grid grid-cols-4 gap-2 mb-2 text-xs text-muted-foreground">
              <div>Symbol</div>
              <div>Price (USD)</div>
              <div>Size</div>
              <div>Time</div>
            </div>

            <div className="space-y-2">
              {marketTradesData.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 gap-2 text-xs border-b border-border pb-2 last:border-0 last:pb-0"
                >
                  <div>{item.symbol}</div>
                  <div className="text-emerald-500">${item.price}</div>
                  <div>
                    {item.size} {item.symbol}
                  </div>
                  <div>{item.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
