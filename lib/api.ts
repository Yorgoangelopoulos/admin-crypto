// API utility functions

// Function to fetch cryptocurrency data
export async function fetchCryptoData(endpoint = "cryptocurrency/listings/latest", limit = 10) {
  try {
    const response = await fetch(`/api/crypto?endpoint=${endpoint}&limit=${limit}`, {
      cache: "no-store", // Disable caching for real-time data
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching crypto data:", error)

    // Return fallback data structure
    return {
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
      ],
    }
  }
}

// Function to fetch specific cryptocurrency details
export async function fetchCryptoDetails(symbol: string) {
  try {
    const response = await fetch(`/api/crypto?endpoint=cryptocurrency/quotes/latest&symbol=${symbol}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error fetching details for ${symbol}:`, error)

    // Return fallback data for the requested symbol
    const fallbackData = {
      id: 1,
      name: symbol === "BTC" ? "Bitcoin" : symbol,
      symbol: symbol,
      circulating_supply: 19500000,
      max_supply: 21000000,
      quote: {
        USD: {
          price: symbol === "BTC" ? 43250.75 : 2650.3,
          percent_change_24h: 2.45,
          market_cap: 843875625000,
          volume_24h: 28500000000,
        },
      },
    }

    return {
      data: {
        [symbol]: [fallbackData],
      },
    }
  }
}

// Function to format large numbers for display
export function formatNumber(num: number, precision = 2) {
  if (num === null || num === undefined || isNaN(num)) return "N/A"

  if (num >= 1e12) {
    return `$${(num / 1e12).toFixed(precision)}T`
  } else if (num >= 1e9) {
    return `$${(num / 1e9).toFixed(precision)}B`
  } else if (num >= 1e6) {
    return `$${(num / 1e6).toFixed(precision)}M`
  } else if (num >= 1e3) {
    return `$${(num / 1e3).toFixed(precision)}K`
  } else {
    return `$${num.toFixed(precision)}`
  }
}

// Function to format percentage change
export function formatPercentChange(percent: number) {
  if (percent === null || percent === undefined || isNaN(percent)) return "N/A"

  const formattedPercent = percent.toFixed(2)
  return percent >= 0 ? `+${formattedPercent}%` : `${formattedPercent}%`
}

// Function to determine if a percentage change is positive or negative
export function getChangeColor(percent: number) {
  if (percent === null || percent === undefined || isNaN(percent)) return "text-muted-foreground"
  return percent >= 0 ? "text-emerald-500" : "text-red-500"
}

// Function to safely access nested object properties
export function safeGet(obj: any, path: string, defaultValue: any = null) {
  return path.split(".").reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : defaultValue
  }, obj)
}
