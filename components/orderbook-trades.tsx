"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, Loader2, RefreshCw } from "lucide-react"
import { formatPercentChange, getChangeColor } from "@/lib/api"

export default function OrderbookTrades() {
  const [cryptoData, setCryptoData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedCrypto, setSelectedCrypto] = useState("BTC")

  useEffect(() => {
    fetchData()

    // Set up interval to refresh data every minute
    const intervalId = setInterval(fetchData, 60 * 1000)

    return () => clearInterval(intervalId)
  }, [selectedCrypto])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Use the crypto API endpoint that returns market data
      const response = await fetch("/api/crypto")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("API Response:", data) // Debug log

      let cryptoInfo = null

      // Handle different possible response structures
      if (Array.isArray(data)) {
        // If data is an array, find the crypto
        cryptoInfo = data.find((crypto: any) => crypto.symbol === selectedCrypto)
      } else if (data && typeof data === "object") {
        // If data is an object, check for common structures
        if (data.data && Array.isArray(data.data)) {
          cryptoInfo = data.data.find((crypto: any) => crypto.symbol === selectedCrypto)
        } else if (data.result && Array.isArray(data.result)) {
          cryptoInfo = data.result.find((crypto: any) => crypto.symbol === selectedCrypto)
        } else if (data[selectedCrypto]) {
          // Direct access by symbol
          cryptoInfo = data[selectedCrypto]
        } else {
          // Try to find in any array property
          for (const key in data) {
            if (Array.isArray(data[key])) {
              cryptoInfo = data[key].find((crypto: any) => crypto.symbol === selectedCrypto)
              if (cryptoInfo) break
            }
          }
        }
      }

      if (cryptoInfo) {
        // Transform the data to match expected structure
        setCryptoData({
          id: cryptoInfo.id || 1,
          name: cryptoInfo.name || (selectedCrypto === "BTC" ? "Bitcoin" : selectedCrypto),
          symbol: cryptoInfo.symbol || selectedCrypto,
          circulating_supply: cryptoInfo.circulating_supply || cryptoInfo.circulatingSupply || 19500000,
          max_supply: cryptoInfo.max_supply || cryptoInfo.maxSupply || 21000000,
          quote: {
            USD: {
              price: cryptoInfo.price || cryptoInfo.quote?.USD?.price || 43250.75,
              percent_change_24h: cryptoInfo.percent_change_24h || cryptoInfo.quote?.USD?.percent_change_24h || 2.45,
              market_cap: cryptoInfo.market_cap || cryptoInfo.quote?.USD?.market_cap || 843875625000,
              volume_24h: cryptoInfo.volume_24h || cryptoInfo.quote?.USD?.volume_24h || 28500000000,
              high_24h: cryptoInfo.high_24h || (cryptoInfo.price || 43250.75) * 1.02,
              low_24h: cryptoInfo.low_24h || (cryptoInfo.price || 43250.75) * 0.98,
            },
          },
        })
      } else {
        throw new Error(`${selectedCrypto} not found in market data`)
      }
    } catch (err) {
      setError(`Failed to fetch data for ${selectedCrypto}`)
      console.error("Orderbook fetch error:", err)

      // Set fallback data with realistic values based on selected crypto
      const fallbackData = {
        BTC: {
          name: "Bitcoin",
          price: 43250.75,
          percent_change_24h: 2.45,
          market_cap: 843875625000,
          volume_24h: 28500000000,
          circulating_supply: 19500000,
          max_supply: 21000000,
        },
        ETH: {
          name: "Ethereum",
          price: 2650.3,
          percent_change_24h: -1.25,
          market_cap: 318500000000,
          volume_24h: 15200000000,
          circulating_supply: 120000000,
          max_supply: null,
        },
        ADA: {
          name: "Cardano",
          price: 0.485,
          percent_change_24h: 3.15,
          market_cap: 17200000000,
          volume_24h: 850000000,
          circulating_supply: 35500000000,
          max_supply: 45000000000,
        },
        SOL: {
          name: "Solana",
          price: 98.75,
          percent_change_24h: 5.82,
          market_cap: 45800000000,
          volume_24h: 2100000000,
          circulating_supply: 464000000,
          max_supply: null,
        },
        DOT: {
          name: "Polkadot",
          price: 7.25,
          percent_change_24h: -0.95,
          market_cap: 9800000000,
          volume_24h: 420000000,
          circulating_supply: 1350000000,
          max_supply: null,
        },
      }

      const fallback = fallbackData[selectedCrypto as keyof typeof fallbackData] || fallbackData.BTC

      setCryptoData({
        id: 1,
        name: fallback.name,
        symbol: selectedCrypto,
        circulating_supply: fallback.circulating_supply,
        max_supply: fallback.max_supply,
        quote: {
          USD: {
            price: fallback.price,
            percent_change_24h: fallback.percent_change_24h,
            market_cap: fallback.market_cap,
            volume_24h: fallback.volume_24h,
            high_24h: fallback.price * 1.02,
            low_24h: fallback.price * 0.98,
          },
        },
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchData()
  }

  // Generate simulated orderbook data
  const generateOrderbookData = (basePrice: number) => {
    const bids = []
    const asks = []

    for (let i = 0; i < 7; i++) {
      const bidPrice = basePrice * (1 - Math.random() * 0.01 * (i + 1))
      const askPrice = basePrice * (1 + Math.random() * 0.01 * (i + 1))

      bids.push({
        size: (Math.random() * 5).toFixed(4),
        price: bidPrice.toFixed(basePrice > 1000 ? 1 : 4),
      })

      asks.push({
        price: askPrice.toFixed(basePrice > 1000 ? 1 : 4),
        size: (Math.random() * 5).toFixed(4),
      })
    }

    return { bids, asks }
  }

  // Get simulated orderbook data
  const orderbook = cryptoData ? generateOrderbookData(cryptoData.quote.USD.price) : { bids: [], asks: [] }

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Orderbook and Trades</h2>
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

      <div className="mb-4">
        <select
          value={selectedCrypto}
          onChange={(e) => setSelectedCrypto(e.target.value)}
          className="bg-background border border-border rounded-md px-3 py-1 text-sm"
        >
          <option value="BTC">Bitcoin (BTC)</option>
          <option value="ETH">Ethereum (ETH)</option>
          <option value="ADA">Cardano (ADA)</option>
          <option value="SOL">Solana (SOL)</option>
          <option value="DOT">Polkadot (DOT)</option>
        </select>
      </div>

      {loading && !cryptoData ? (
        <div className="flex items-center justify-center h-[300px]">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[300px]">
          <div className="text-center">
            <p className="text-red-500 mb-2">Using fallback data</p>
            <p className="text-xs text-muted-foreground mb-2">{error}</p>
            <button onClick={fetchData} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">
              Try Again
            </button>
          </div>
        </div>
      ) : (
        cryptoData && (
          <>
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                <div className="bg-orange-500 rounded-full h-6 w-6 flex items-center justify-center mr-2">
                  <span className="text-white text-xs">{cryptoData.symbol.substring(0, 1)}</span>
                </div>
                <span className="font-medium">{cryptoData.name}</span>
              </div>
            </div>

            <div className="flex items-baseline mb-4">
              <div className="text-2xl font-bold">
                $
                {cryptoData.quote.USD.price.toLocaleString(undefined, {
                  minimumFractionDigits: cryptoData.quote.USD.price > 1000 ? 2 : 4,
                  maximumFractionDigits: cryptoData.quote.USD.price > 1000 ? 2 : 4,
                })}
              </div>
              <div className="ml-2 text-sm">
                <span className={getChangeColor(cryptoData.quote.USD.percent_change_24h)}>
                  {formatPercentChange(cryptoData.quote.USD.percent_change_24h)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="text-xs text-muted-foreground">Bid Size ({cryptoData.symbol})</div>
                  <div className="text-xs text-muted-foreground">Bid Price (USD)</div>
                </div>

                <div className="space-y-1">
                  {orderbook.bids.map((item, index) => (
                    <div key={index} className="grid grid-cols-2 gap-2 text-xs">
                      <div>{item.size}</div>
                      <div className="text-emerald-500">{item.price}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="text-xs text-muted-foreground">Ask Price (USD)</div>
                  <div className="text-xs text-muted-foreground">Ask Size ({cryptoData.symbol})</div>
                </div>

                <div className="space-y-1">
                  {orderbook.asks.map((item, index) => (
                    <div key={index} className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-red-500">{item.price}</div>
                      <div>{item.size}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 mt-4">
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-xs text-muted-foreground">Vol (24h)</div>
                  <div className="text-xs">
                    ${cryptoData.quote.USD.volume_24h.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-xs text-muted-foreground">Open (24h)</div>
                  <div className="text-xs">
                    $
                    {(cryptoData.quote.USD.price / (1 + cryptoData.quote.USD.percent_change_24h / 100)).toLocaleString(
                      undefined,
                      { maximumFractionDigits: 2 },
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-xs text-muted-foreground">Low (24h)</div>
                  <div className="text-xs text-red-500">
                    $
                    {cryptoData.quote.USD.low_24h?.toLocaleString(undefined, { maximumFractionDigits: 2 }) ||
                      (cryptoData.quote.USD.price * 0.98).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-xs text-muted-foreground">Market Cap</div>
                  <div className="text-xs">
                    ${cryptoData.quote.USD.market_cap.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-xs text-muted-foreground">Supply</div>
                  <div className="text-xs">
                    {cryptoData.circulating_supply.toLocaleString(undefined, { maximumFractionDigits: 0 })}{" "}
                    {cryptoData.symbol}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-xs text-muted-foreground">Trades (24h)</div>
                  <div className="text-xs">
                    {Math.floor(cryptoData.quote.USD.volume_24h / cryptoData.quote.USD.price / 10).toLocaleString()}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-xs text-muted-foreground">High (24h)</div>
                  <div className="text-xs text-emerald-500">
                    $
                    {cryptoData.quote.USD.high_24h?.toLocaleString(undefined, { maximumFractionDigits: 2 }) ||
                      (cryptoData.quote.USD.price * 1.02).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-xs text-muted-foreground">Max Supply</div>
                  <div className="text-xs">
                    {cryptoData.max_supply
                      ? `${cryptoData.max_supply.toLocaleString(undefined, { maximumFractionDigits: 0 })} ${cryptoData.symbol}`
                      : "Unlimited"}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
              <button className="bg-emerald-500 text-white px-6 py-2 rounded font-medium flex-1 flex items-center justify-center">
                BUY
                <ChevronDown className="h-4 w-4 inline-block ml-1" />
              </button>
              <button className="bg-red-500 text-white px-6 py-2 rounded font-medium flex-1 flex items-center justify-center">
                SELL
                <ChevronUp className="h-4 w-4 inline-block ml-1" />
              </button>
            </div>
          </>
        )
      )}
    </div>
  )
}
