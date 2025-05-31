"use client"

import { useState, useEffect } from "react"
import { Loader2, RefreshCw } from "lucide-react"
import { fetchCryptoData, formatNumber, formatPercentChange, getChangeColor } from "@/lib/api"
import { getWatchlist } from "@/lib/supabase-api"

export default function Watchlist() {
  const [watchlistData, setWatchlistData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  // Define watchlist symbols - in a real app, this would come from user preferences
  const watchlistSymbols = ["BTC", "ETH", "BNB", "XRP", "ADA", "SOL", "DOGE", "DOT"]

  useEffect(() => {
    fetchData()

    // Set up interval to refresh data every 5 minutes
    const intervalId = setInterval(fetchData, 5 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get watchlist from Supabase
      const watchlistItems = await getWatchlist()
      const watchlistSymbols = watchlistItems.map((item) => item.symbol)

      // Fetch crypto data
      const data = await fetchCryptoData("cryptocurrency/listings/latest", 100)

      // Ensure data structure is correct
      if (data && data.data && Array.isArray(data.data)) {
        // Filter data to only include watchlist symbols
        const filteredData = data.data.filter((crypto: any) =>
          watchlistSymbols.length > 0
            ? watchlistSymbols.includes(crypto.symbol)
            : ["BTC", "ETH", "BNB", "XRP", "ADA", "SOL", "DOGE", "DOT"].includes(crypto.symbol),
        )
        setWatchlistData(filteredData)
      } else {
        throw new Error("Invalid data structure received")
      }
    } catch (err) {
      setError("Failed to fetch watchlist data")
      console.error("Watchlist fetch error:", err)

      // Set fallback data
      setWatchlistData([
        {
          id: 1,
          symbol: "BTC",
          quote: {
            USD: {
              price: 43250.75,
              percent_change_24h: 2.45,
              volume_24h: 28500000000,
            },
          },
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
        <h2 className="text-lg font-bold">Watchlist</h2>
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

      {loading && watchlistData.length === 0 ? (
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
              <div>Crypto</div>
              <div>Price</div>
              <div>Chg(%)</div>
              <div>Volume</div>
            </div>

            <div className="space-y-2">
              {watchlistData.map((crypto) => (
                <div
                  key={crypto.id}
                  className="grid grid-cols-4 gap-2 text-xs border-b border-border pb-2 last:border-0 last:pb-0"
                >
                  <div className="flex items-center">
                    <span>{crypto.symbol}</span>
                  </div>
                  <div>${crypto.quote.USD.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                  <div className={getChangeColor(crypto.quote.USD.percent_change_24h)}>
                    {formatPercentChange(crypto.quote.USD.percent_change_24h)}
                  </div>
                  <div>{formatNumber(crypto.quote.USD.volume_24h)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
