"use client"

import { useState, useEffect, useRef } from "react"
import { MoreVertical, Loader2 } from "lucide-react"
import { fetchCryptoData, formatNumber, formatPercentChange, getChangeColor } from "@/lib/api"

export default function PortfolioStats() {
  const [activeTab, setActiveTab] = useState("1W")
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cryptoData, setCryptoData] = useState<any>(null)
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    fetchData()

    // Set up interval to refresh data every 5 minutes
    const intervalId = setInterval(fetchData, 5 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchCryptoData("cryptocurrency/listings/latest", 10)

      // Ensure data structure is correct
      if (data && data.data && Array.isArray(data.data)) {
        setCryptoData(data.data)
      } else {
        throw new Error("Invalid data structure received")
      }
    } catch (err) {
      setError("Failed to fetch cryptocurrency data")
      console.error("Portfolio stats fetch error:", err)

      // Set fallback data
      setCryptoData([
        {
          id: 1,
          name: "Bitcoin",
          symbol: "BTC",
          quote: {
            USD: {
              price: 43250.75,
              percent_change_24h: 2.45,
              market_cap: 843875625000,
            },
          },
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  // Get Bitcoin data
  const bitcoinData = cryptoData?.find((crypto: any) => crypto.symbol === "BTC")

  // Simple SVG chart to avoid ResizeObserver issues
  const renderChart = () => {
    if (!mounted) return null

    // Sample chart data - in a real app, you would use historical data from the API
    const chartData = [
      { date: "Nov 12", price: 39800 },
      { date: "Nov 13", price: 40200 },
      { date: "Nov 14", price: 40500 },
      { date: "Nov 15", price: 41200 },
      { date: "Nov 16", price: 42100 },
      { date: "Nov 17", price: 41800 },
      { date: "Nov 18", price: bitcoinData?.quote?.USD?.price || 41561 },
    ]

    const width = 400
    const height = 200
    const padding = 40

    const maxPrice = Math.max(...chartData.map((d) => d.price))
    const minPrice = Math.min(...chartData.map((d) => d.price))
    const priceRange = maxPrice - minPrice

    const points = chartData
      .map((data, index) => {
        const x = padding + (index * (width - 2 * padding)) / (chartData.length - 1)
        const y = height - padding - ((data.price - minPrice) / priceRange) * (height - 2 * padding)
        return `${x},${y}`
      })
      .join(" ")

    return (
      <svg width="100%" height="200" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Chart line */}
        <polyline fill="none" stroke="hsl(var(--primary))" strokeWidth="2" points={points} />

        {/* Data points */}
        {chartData.map((data, index) => {
          const x = padding + (index * (width - 2 * padding)) / (chartData.length - 1)
          const y = height - padding - ((data.price - minPrice) / priceRange) * (height - 2 * padding)
          return (
            <circle key={index} cx={x} cy={y} r="3" fill="hsl(var(--primary))" className="hover:r-4 transition-all" />
          )
        })}

        {/* Y-axis labels */}
        {[minPrice, (minPrice + maxPrice) / 2, maxPrice].map((price, index) => {
          const y = height - padding - (index * (height - 2 * padding)) / 2
          return (
            <text
              key={index}
              x={padding - 10}
              y={y + 4}
              textAnchor="end"
              fontSize="10"
              fill="hsl(var(--muted-foreground))"
            >
              ${Math.round(price).toLocaleString()}
            </text>
          )
        })}

        {/* X-axis labels */}
        {chartData.map((data, index) => {
          if (index % 2 === 0) {
            // Show every other label to avoid crowding
            const x = padding + (index * (width - 2 * padding)) / (chartData.length - 1)
            return (
              <text
                key={index}
                x={x}
                y={height - 10}
                textAnchor="middle"
                fontSize="10"
                fill="hsl(var(--muted-foreground))"
              >
                {data.date}
              </text>
            )
          }
          return null
        })}
      </svg>
    )
  }

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Portfolio Stats</h2>
        <button>
          <MoreVertical className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      {loading && !cryptoData ? (
        <div className="flex items-center justify-center h-[300px]">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[300px]">
          <div className="text-center">
            <p className="text-red-500 mb-2">Error loading data</p>
            <button onClick={fetchData} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <div className="text-xs text-muted-foreground">Bitcoin Price</div>
            <div className="text-2xl font-bold">
              {bitcoinData
                ? `$${bitcoinData.quote.USD.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                : "Loading..."}
            </div>
            <div className="flex items-center mt-1">
              <span
                className={`text-sm font-medium ${bitcoinData ? getChangeColor(bitcoinData.quote.USD.percent_change_24h) : ""}`}
              >
                {bitcoinData ? formatPercentChange(bitcoinData.quote.USD.percent_change_24h) : ""}
              </span>
              <span className="text-xs text-muted-foreground ml-2">Past 24h</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Market Cap: {bitcoinData ? formatNumber(bitcoinData.quote.USD.market_cap) : "Loading..."}
            </div>
          </div>

          <div className="h-[200px] mb-4" ref={chartRef}>
            {renderChart()}
          </div>

          <div className="flex justify-end mt-4 space-x-2">
            <button
              className={`px-2 py-1 text-xs rounded transition-colors ${activeTab === "24H" ? "bg-muted text-foreground" : "hover:bg-muted/50"}`}
              onClick={() => setActiveTab("24H")}
            >
              24H
            </button>
            <button
              className={`px-2 py-1 text-xs rounded transition-colors ${activeTab === "1W" ? "bg-muted text-foreground" : "hover:bg-muted/50"}`}
              onClick={() => setActiveTab("1W")}
            >
              1W
            </button>
            <button
              className={`px-2 py-1 text-xs rounded transition-colors ${activeTab === "1M" ? "bg-muted text-foreground" : "hover:bg-muted/50"}`}
              onClick={() => setActiveTab("1M")}
            >
              1M
            </button>
            <button
              className={`px-2 py-1 text-xs rounded transition-colors ${activeTab === "3M" ? "bg-muted text-foreground" : "hover:bg-muted/50"}`}
              onClick={() => setActiveTab("3M")}
            >
              3M
            </button>
            <button
              className={`px-2 py-1 text-xs rounded transition-colors ${activeTab === "1Y" ? "bg-muted text-foreground" : "hover:bg-muted/50"}`}
              onClick={() => setActiveTab("1Y")}
            >
              1Y
            </button>
          </div>
        </>
      )}
    </div>
  )
}
