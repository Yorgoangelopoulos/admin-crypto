"use client"

import { useRef, useEffect, useState } from "react"
import { Loader2, RefreshCw } from "lucide-react"
import { fetchCryptoData, formatNumber, formatPercentChange, getChangeColor } from "@/lib/api"

// Kripto logoları için URL mapping - daha güvenilir kaynaklar
const cryptoLogos: { [key: string]: string } = {
  BTC: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiNGNzkzMUEiLz4KPHN2ZyB4PSI2IiB5PSI2IiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0xMy4yIDEwLjJDMTMuNiA5LjggMTMuOCA5LjIgMTMuOCA4LjZDMTMuOCA3LjQgMTIuOCA2LjQgMTEuNiA2LjRIOC40VjEzLjZIMTEuNkMxMi44IDEzLjYgMTMuOCAxMi42IDEzLjggMTEuNEMxMy44IDEwLjggMTMuNiAxMC4yIDEzLjIgMTAuMloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xMC40IDkuNkg5LjJWOC40SDEwLjRDMTAuOCA4LjQgMTEuMiA4LjggMTEuMiA5LjJDMTEuMiA5LjYgMTAuOCA5LjYgMTAuNCA5LjZaIiBmaWxsPSIjRjc5MzFBIi8+CjxwYXRoIGQ9Ik0xMC44IDExLjZIOS4yVjEwLjRIMTAuOEMxMS4yIDEwLjQgMTEuNiAxMC44IDExLjYgMTEuMkMxMS42IDExLjYgMTEuMiAxMS42IDEwLjggMTEuNloiIGZpbGw9IiNGNzkzFBIiLz4KPC9zdmc+Cjwvc3ZnPgo=",
  ETH: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiM2MjdFRUEiLz4KPHN2ZyB4PSI2IiB5PSI2IiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0xMCA0TDkuOCA2LjJMMTAgMTJMMTAuMiA2LjJMMTAgNFoiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNiIvPgo8cGF0aCBkPSJNMTAgMTJMMTYgMTBMMTAgNFY0WiIgZmlsbD0id2hpdGUiLz4KPHN0cm9rZSBkPSJNMTAgMTJMNCAxMEwxMCA0VjRaIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjYiLz4KPHN0cm9rZSBkPSJNMTAgMTZMMTYgMTBMMTAgMTJWMTJaIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjIiLz4KPHN0cm9rZSBkPSJNMTAgMTZMNCAxMEwxMCAxMlYxMloiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNiIvPgo8L3N2Zz4KPC9zdmc+Cg==",
  USDT: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiMyNkE1NEIiLz4KPHN2ZyB4PSI2IiB5PSI2IiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSI+CjxyZWN0IHg9IjgiIHk9IjQiIHdpZHRoPSI0IiBoZWlnaHQ9IjEyIiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCB4PSI0IiB5PSI4IiB3aWR0aD0iMTIiIGhlaWdodD0iNCIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cjwvc3ZnPgo=",
  BNB: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiNGM0JBMkYiLz4KPHN2ZyB4PSI2IiB5PSI2IiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0xMCA0TDEyIDZMMTAgOEw4IDZMMTAgNFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik02IDEwTDggOEw2IDZMNCA4TDYgMTBaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTQgMTBMMTYgOEwxNCA2TDEyIDhMMTQgMTBaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTAgMTJMMTIgMTBMMTAgOEw4IDEwTDEwIDEyWiIgZmlsbD0id2hpdGUiLz4KPHN0cm9rZSBkPSJNMTAgMTZMMTIgMTRMMTAgMTJMOCAxNEwxMCAxNloiIGZpbGw9IndoaXRlIi8+CjwvcGF0aD4KPC9zdmc+Cjwvc3ZnPgo=",
  SOL: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiM5OTQ1RkYiLz4KPHN2ZyB4PSI2IiB5PSI2IiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik00IDEySDEyTDE2IDhIMTZIMTJMOCA4SDRaIiBmaWxsPSJ3aGl0ZSIvPgo8c3Ryb2tlIGQ9Ik00IDE2SDEyTDE2IDEySDE2SDEyTDggMTZI NFoiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuOCIvPgo8c3Ryb2tlIGQ9Ik00IDhIMTJMMTYgNEgxNkgxMkw4IDhINFoiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNiIvPgo8L3N2Zz4KPC9zdmc+Cg==",
  XRP: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiMyMzI5MkYiLz4KPHN2ZyB4PSI2IiB5PSI2IiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik00IDRIMTJMMTYgOEwxMiAxMkg0VjRaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTYgNEgxNkwxMiA4TDE2IDEySDEyVjRaIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjgiLz4KPHN0cm9rZSBkPSJNNCAxNkgxMkwxNiAxMkwxMiA4SDRWMTZaIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjYiLz4KPC9zdmc+Cjwvc3ZnPgo=",
  ADA: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiMzQ0M4QzgiLz4KPHN2ZyB4PSI2IiB5PSI2IiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSI+CjxjaXJjbGUgY3g9IjEwIiBjeT0iMTAiIHI9IjYiIGZpbGw9IndoaXRlIi8+CjxjaXJjbGUgY3g9IjEwIiBjeT0iMTAiIHI9IjMiIGZpbGw9IiMzQ0M4QzgiLz4KPC9zdmc+Cjwvc3ZnPgo=",
  DOGE: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiNDMkE2MzMiLz4KPHN2ZyB4PSI2IiB5PSI2IiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSI+CjxyZWN0IHg9IjQiIHk9IjQiIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgcng9IjYiIGZpbGw9IndoaXRlIi8+CjxyZWN0IHg9IjYiIHk9IjYiIHdpZHRoPSI4IiBoZWlnaHQ9IjgiIHJ4PSI0IiBmaWxsPSIjQzJBNjMzIi8+CjwvcGF0aD4KPC9zdmc+Cjwvc3ZnPgo=",
  DOT: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiNFNjAwN0EiLz4KPHN2ZyB4PSI2IiB5PSI2IiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSI+CjxjaXJjbGUgY3g9IjEwIiBjeT0iMTAiIHI9IjYiIGZpbGw9IndoaXRlIi8+CjxjaXJjbGUgY3g9IjEwIiBjeT0iMTAiIHI9IjMiIGZpbGw9IiNFNjAwN0EiLz4KPC9zdmc+Cjwvc3ZnPgo=",
  USDC: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiMyNzc1Q0EiLz4KPHN2ZyB4PSI2IiB5PSI2IiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSI+CjxjaXJjbGUgY3g9IjEwIiBjeT0iMTAiIHI9IjYiIGZpbGw9IndoaXRlIi8+CjxyZWN0IHg9IjgiIHk9IjYiIHdpZHRoPSI0IiBoZWlnaHQ9IjgiIGZpbGw9IiMyNzc1Q0EiLz4KPC9zdmc+Cjwvc3ZnPgo=",
  TRX: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiNGRjA2MEEiLz4KPHN2ZyB4PSI2IiB5PSI2IiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0xMCA0TDE2IDEwTDEwIDE2TDQgMTBMMTAgNFoiIGZpbGw9IndoaXRlIi8+CjwvcGF0aD4KPC9zdmc+Cjwvc3ZnPgo=",
  HYPE: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiMwMDAwRkYiLz4KPHN2ZyB4PSI2IiB5PSI2IiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSI+CjxyZWN0IHg9IjQiIHk9IjQiIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cjwvc3ZnPgo=",
  SUI: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiM0Q0E1RkYiLz4KPHN2ZyB4PSI2IiB5PSI2IiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSI+CjxjaXJjbGUgY3g9IjEwIiBjeT0iMTAiIHI9IjYiIGZpbGw9IndoaXRlIi8+CjwvcGF0aD4KPC9zdmc+Cjwvc3ZnPgo=",
}

export default function ExploreMarket() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [cryptoData, setCryptoData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

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
      const data = await fetchCryptoData("cryptocurrency/listings/latest", 20)

      // Ensure data structure is correct
      if (data && data.data && Array.isArray(data.data)) {
        setCryptoData(data.data)
      } else {
        throw new Error("Invalid data structure received")
      }
    } catch (err) {
      setError("Failed to fetch cryptocurrency data")
      console.error("Explore market fetch error:", err)

      // Set fallback data
      setCryptoData([
        {
          id: 1,
          name: "Bitcoin",
          symbol: "BTC",
          quote: { USD: { price: 103902.53, percent_change_24h: 2.45, market_cap: 2057000000000 } },
        },
        {
          id: 1027,
          name: "Ethereum",
          symbol: "ETH",
          quote: { USD: { price: 2523.33, percent_change_24h: -3.28, market_cap: 304630000000 } },
        },
        {
          id: 825,
          name: "Tether USDt",
          symbol: "USDT",
          quote: { USD: { price: 1.0, percent_change_24h: 0.04, market_cap: 153090000000 } },
        },
        {
          id: 52,
          name: "XRP",
          symbol: "XRP",
          quote: { USD: { price: 2.14, percent_change_24h: -1.98, market_cap: 125740000000 } },
        },
        {
          id: 1839,
          name: "BNB",
          symbol: "BNB",
          quote: { USD: { price: 654.88, percent_change_24h: -2.28, market_cap: 92260000000 } },
        },
        {
          id: 5426,
          name: "Solana",
          symbol: "SOL",
          quote: { USD: { price: 155.32, percent_change_24h: -4.8, market_cap: 81120000000 } },
        },
        {
          id: 3408,
          name: "USDC",
          symbol: "USDC",
          quote: { USD: { price: 0.9999, percent_change_24h: 0.0, market_cap: 61040000000 } },
        },
        {
          id: 74,
          name: "Dogecoin",
          symbol: "DOGE",
          quote: { USD: { price: 0.1901, percent_change_24h: -6.68, market_cap: 28420000000 } },
        },
        {
          id: 1958,
          name: "TRON",
          symbol: "TRX",
          quote: { USD: { price: 0.2689, percent_change_24h: -0.09, market_cap: 25510000000 } },
        },
        {
          id: 2010,
          name: "Cardano",
          symbol: "ADA",
          quote: { USD: { price: 0.6697, percent_change_24h: -4.25, market_cap: 23670000000 } },
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

  // Mouse wheel horizontal scroll handler
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      // Check if we're scrolling vertically and the container can scroll horizontally
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && container.scrollWidth > container.clientWidth) {
        e.preventDefault()
        container.scrollLeft += e.deltaY
      }
    }

    container.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
      container.removeEventListener("wheel", handleWheel)
    }
  }, [])

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Explore Market</h2>
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

      {loading && cryptoData.length === 0 ? (
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
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide hover:scrollbar-show transition-all duration-200"
          style={{
            scrollbarWidth: "none" /* Firefox */,
            msOverflowStyle: "none" /* IE and Edge */,
          }}
        >
          <div className="min-w-[800px]">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-muted-foreground border-b border-border">
                  <th className="pb-2 text-left">CRYPTO NAME</th>
                  <th className="pb-2 text-right">PRICE</th>
                  <th className="pb-2 text-right">24H CHANGE</th>
                  <th className="pb-2 text-right">MARKET CAP</th>
                  <th className="pb-2 text-right">VOLUME (24H)</th>
                  <th className="pb-2 text-right">CIRCULATING SUPPLY</th>
                </tr>
              </thead>
              <tbody>
                {cryptoData.map((crypto) => (
                  <tr
                    key={crypto.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => {
                      console.log(`Clicked on ${crypto.name} (${crypto.symbol})`)
                      // Burada kripto detay sayfasına yönlendirme yapılabilir
                    }}
                  >
                    <td className="py-3">
                      <div className="flex items-center">
                        <div className="bg-muted rounded-full h-8 w-8 flex items-center justify-center mr-3 overflow-hidden">
                          <img
                            src={cryptoLogos[crypto.symbol] || "/placeholder.svg"}
                            alt={`${crypto.name} logo`}
                            className="h-6 w-6 object-contain"
                            crossOrigin="anonymous"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              // Fallback to a colored circle with symbol
                              const parent = target.parentElement
                              if (parent) {
                                parent.innerHTML = `
                                  <div class="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white text-xs font-bold">
                                    ${crypto.symbol.charAt(0)}
                                  </div>
                                `
                              }
                            }}
                          />
                        </div>
                        <div>
                          <span className="font-medium text-sm">{crypto.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">{crypto.symbol}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-right">
                      ${crypto.quote.USD.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                    <td className={`py-3 text-sm text-right ${getChangeColor(crypto.quote.USD.percent_change_24h)}`}>
                      {formatPercentChange(crypto.quote.USD.percent_change_24h)}
                    </td>
                    <td className="py-3 text-sm text-right">{formatNumber(crypto.quote.USD.market_cap)}</td>
                    <td className="py-3 text-sm text-right">{formatNumber(crypto.quote.USD.volume_24h)}</td>
                    <td className="py-3 text-sm text-right">
                      {crypto.circulating_supply.toLocaleString(undefined, { maximumFractionDigits: 0 })}{" "}
                      {crypto.symbol}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
