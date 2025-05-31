import { NextResponse } from "next/server"

// CoinMarketCap API endpoints
const CMC_API_URL = "https://pro-api.coinmarketcap.com/v1"

// Fallback data for when API is not available
const FALLBACK_DATA = {
  data: [
    {
      id: 1,
      name: "Bitcoin",
      symbol: "BTC",
      circulating_supply: 19500000,
      max_supply: 21000000,
      quote: {
        USD: {
          price: 43250.75,
          percent_change_24h: 2.45,
          market_cap: 843875625000,
          volume_24h: 28500000000,
        },
      },
    },
    {
      id: 1027,
      name: "Ethereum",
      symbol: "ETH",
      circulating_supply: 120280000,
      max_supply: null,
      quote: {
        USD: {
          price: 2650.3,
          percent_change_24h: -1.25,
          market_cap: 318742360000,
          volume_24h: 15200000000,
        },
      },
    },
    {
      id: 825,
      name: "Tether",
      symbol: "USDT",
      circulating_supply: 91500000000,
      max_supply: null,
      quote: {
        USD: {
          price: 1.0,
          percent_change_24h: 0.01,
          market_cap: 91500000000,
          volume_24h: 45800000000,
        },
      },
    },
    {
      id: 1839,
      name: "BNB",
      symbol: "BNB",
      circulating_supply: 153856150,
      max_supply: 200000000,
      quote: {
        USD: {
          price: 315.75,
          percent_change_24h: 1.85,
          market_cap: 48592847375,
          volume_24h: 1850000000,
        },
      },
    },
    {
      id: 52,
      name: "XRP",
      symbol: "XRP",
      circulating_supply: 53175654408,
      max_supply: 100000000000,
      quote: {
        USD: {
          price: 0.6125,
          percent_change_24h: 3.25,
          market_cap: 32570088000,
          volume_24h: 2100000000,
        },
      },
    },
    {
      id: 5426,
      name: "Solana",
      symbol: "SOL",
      circulating_supply: 428500000,
      max_supply: null,
      quote: {
        USD: {
          price: 98.45,
          percent_change_24h: 5.75,
          market_cap: 42200825000,
          volume_24h: 3200000000,
        },
      },
    },
    {
      id: 3408,
      name: "USDC",
      symbol: "USDC",
      circulating_supply: 25800000000,
      max_supply: null,
      quote: {
        USD: {
          price: 1.0,
          percent_change_24h: -0.01,
          market_cap: 25800000000,
          volume_24h: 8500000000,
        },
      },
    },
    {
      id: 2010,
      name: "Cardano",
      symbol: "ADA",
      circulating_supply: 35045020830,
      max_supply: 45000000000,
      quote: {
        USD: {
          price: 0.485,
          percent_change_24h: 2.15,
          market_cap: 16996835102,
          volume_24h: 850000000,
        },
      },
    },
    {
      id: 74,
      name: "Dogecoin",
      symbol: "DOGE",
      circulating_supply: 142500000000,
      max_supply: null,
      quote: {
        USD: {
          price: 0.0825,
          percent_change_24h: -2.35,
          market_cap: 11756250000,
          volume_24h: 1200000000,
        },
      },
    },
    {
      id: 6636,
      name: "Polkadot",
      symbol: "DOT",
      circulating_supply: 1355000000,
      max_supply: null,
      quote: {
        USD: {
          price: 7.25,
          percent_change_24h: 1.95,
          market_cap: 9823750000,
          volume_24h: 450000000,
        },
      },
    },
  ],
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const endpoint = searchParams.get("endpoint") || "cryptocurrency/listings/latest"
    const limit = searchParams.get("limit") || "10"
    const symbol = searchParams.get("symbol")

    // Get API key from environment variables
    const apiKey = process.env.COINMARKETCAP_API_KEY

    // If no API key is provided, return fallback data
    if (!apiKey) {
      console.warn("CoinMarketCap API key not found, using fallback data")

      // Filter fallback data based on limit
      const limitNum = Number.parseInt(limit)
      const filteredData = {
        ...FALLBACK_DATA,
        data: FALLBACK_DATA.data.slice(0, limitNum),
      }

      // If requesting specific symbol, filter by symbol
      if (symbol && endpoint.includes("quotes/latest")) {
        const symbolData = FALLBACK_DATA.data.find((crypto) => crypto.symbol === symbol)
        if (symbolData) {
          return NextResponse.json({
            data: {
              [symbol]: [symbolData],
            },
          })
        }
      }

      return NextResponse.json(filteredData)
    }

    // Construct the API URL with parameters
    let apiUrl = `${CMC_API_URL}/${endpoint}?limit=${limit}`

    if (symbol && endpoint.includes("quotes/latest")) {
      apiUrl = `${CMC_API_URL}/${endpoint}?symbol=${symbol}`
    }

    // Make the request to CoinMarketCap API
    const response = await fetch(apiUrl, {
      headers: {
        "X-CMC_PRO_API_KEY": apiKey,
        Accept: "application/json",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      console.warn(`CoinMarketCap API error: ${response.status}, falling back to mock data`)

      // Return fallback data on API error
      const limitNum = Number.parseInt(limit)
      const filteredData = {
        ...FALLBACK_DATA,
        data: FALLBACK_DATA.data.slice(0, limitNum),
      }

      if (symbol && endpoint.includes("quotes/latest")) {
        const symbolData = FALLBACK_DATA.data.find((crypto) => crypto.symbol === symbol)
        if (symbolData) {
          return NextResponse.json({
            data: {
              [symbol]: [symbolData],
            },
          })
        }
      }

      return NextResponse.json(filteredData)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching crypto data:", error)

    // Return fallback data on any error
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") || "10"
    const symbol = searchParams.get("symbol")
    const endpoint = searchParams.get("endpoint") || "cryptocurrency/listings/latest"

    const limitNum = Number.parseInt(limit)
    const filteredData = {
      ...FALLBACK_DATA,
      data: FALLBACK_DATA.data.slice(0, limitNum),
    }

    if (symbol && endpoint.includes("quotes/latest")) {
      const symbolData = FALLBACK_DATA.data.find((crypto) => crypto.symbol === symbol)
      if (symbolData) {
        return NextResponse.json({
          data: {
            [symbol]: [symbolData],
          },
        })
      }
    }

    return NextResponse.json(filteredData)
  }
}
