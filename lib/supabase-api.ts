import { supabase } from "./supabase"

// Generate a proper UUID for demo user
const DEMO_USER_ID = "550e8400-e29b-41d4-a716-446655440000"
const DEMO_EMAIL = "demo@example.com"

// User operations
export async function createOrUpdateUser(userData: any) {
  try {
    // First, try to get existing user
    const { data: existingUser } = await supabase.from("users").select("*").eq("email", DEMO_EMAIL).single()

    if (existingUser) {
      // Update existing user
      const { data, error } = await supabase
        .from("users")
        .update({
          full_name: userData.full_name,
          phone: userData.phone,
          country: userData.country,
          bio: userData.bio,
          profile_picture: userData.profile_picture,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingUser.id)
        .select()
        .single()

      if (error) throw error
      return data
    } else {
      // Create new user with proper UUID
      const { data, error } = await supabase
        .from("users")
        .insert({
          email: DEMO_EMAIL,
          full_name: userData.full_name || "John Doe",
          phone: userData.phone || "+1 (555) 123-4567",
          country: userData.country || "us",
          bio: userData.bio || "Crypto enthusiast and investor since 2017.",
          profile_picture: userData.profile_picture || "/images/monero2.svg",
        })
        .select()
        .single()

      if (error) throw error
      return data
    }
  } catch (error) {
    console.error("Error creating/updating user:", error)
    throw error
  }
}

export async function getUser() {
  try {
    // Check if Supabase is properly configured
    if (!supabase) {
      console.warn("Supabase client not available")
      return null
    }

    const { data, error } = await supabase.from("users").select("*").eq("email", DEMO_EMAIL).single()

    if (error && error.code !== "PGRST116") {
      console.warn("Supabase error:", error.message)
      return null
    }

    return data
  } catch (error) {
    console.warn("Error getting user from Supabase:", error)
    return null
  }
}

// Settings operations
export async function saveUserSettings(settings: any) {
  try {
    // Get user first
    const user = await getUser()
    if (!user) {
      throw new Error("User not found")
    }

    // Check if settings exist
    const { data: existingSettings } = await supabase.from("user_settings").select("*").eq("user_id", user.id).single()

    if (existingSettings) {
      // Update existing settings
      const { data, error } = await supabase
        .from("user_settings")
        .update({
          theme: settings.theme,
          color_scheme: settings.color_scheme,
          language: settings.language,
          currency: settings.currency,
          notifications: settings.notifications,
          security_settings: settings.security_settings,
          two_factor_enabled: settings.two_factor_enabled,
          account_activity: settings.account_activity,
          trading_activity: settings.trading_activity,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .select()
        .single()

      if (error) throw error
      return data
    } else {
      // Create new settings
      const { data, error } = await supabase
        .from("user_settings")
        .insert({
          user_id: user.id,
          theme: settings.theme || "light",
          color_scheme: settings.color_scheme || "emerald",
          language: settings.language || "english",
          currency: settings.currency || "usd",
          notifications: settings.notifications || {},
          security_settings: settings.security_settings || {},
          two_factor_enabled: settings.two_factor_enabled || false,
          account_activity: settings.account_activity || true,
          trading_activity: settings.trading_activity || true,
        })
        .select()
        .single()

      if (error) throw error
      return data
    }
  } catch (error) {
    console.error("Error saving user settings:", error)
    throw error
  }
}

export async function getUserSettings() {
  try {
    // Check if Supabase is properly configured
    if (!supabase) {
      console.warn("Supabase client not available, using localStorage fallback")
      return null
    }

    const user = await getUser()
    if (!user) return null

    const { data, error } = await supabase.from("user_settings").select("*").eq("user_id", user.id).single()

    if (error && error.code !== "PGRST116") {
      console.warn("Supabase error, falling back to localStorage:", error.message)
      return null
    }

    return data
  } catch (error) {
    console.warn("Error getting user settings from Supabase, using fallback:", error)
    return null
  }
}

// Payment methods operations
export async function savePaymentMethods(paymentMethods: any[]) {
  try {
    const user = await getUser()
    if (!user) throw new Error("User not found")

    // Delete existing payment methods
    await supabase.from("payment_methods").delete().eq("user_id", user.id)

    // Insert new payment methods
    const methodsToInsert = paymentMethods.map((method) => ({
      user_id: user.id,
      type: method.type,
      name: method.name,
      is_default: method.is_default,
      verified: method.verified,
      added_date: method.added_date,
    }))

    const { data, error } = await supabase.from("payment_methods").insert(methodsToInsert).select()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error saving payment methods:", error)
    throw error
  }
}

export async function getPaymentMethods() {
  try {
    const user = await getUser()
    if (!user) return []

    const { data, error } = await supabase
      .from("payment_methods")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error getting payment methods:", error)
    return []
  }
}

// Watchlist operations
export async function saveWatchlistItem(symbol: string) {
  try {
    const user = await getUser()
    if (!user) throw new Error("User not found")

    const { data, error } = await supabase
      .from("watchlist")
      .insert({
        user_id: user.id,
        symbol: symbol.toUpperCase(),
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error saving watchlist item:", error)
    throw error
  }
}

export async function removeWatchlistItem(symbol: string) {
  try {
    const user = await getUser()
    if (!user) throw new Error("User not found")

    const { error } = await supabase
      .from("watchlist")
      .delete()
      .eq("user_id", user.id)
      .eq("symbol", symbol.toUpperCase())

    if (error) throw error
  } catch (error) {
    console.error("Error removing watchlist item:", error)
    throw error
  }
}

export async function getWatchlist() {
  try {
    const user = await getUser()
    if (!user) return []

    const { data, error } = await supabase
      .from("watchlist")
      .select("*")
      .eq("user_id", user.id)
      .order("added_at", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error getting watchlist:", error)
    return []
  }
}

// Initialize user data
export async function initializeUserData() {
  try {
    // Check if Supabase is available
    if (!supabase) {
      console.warn("Supabase not available, skipping initialization")
      return false
    }

    // Test Supabase connection first
    const { error: connectionError } = await supabase.from("users").select("count").limit(1)
    if (connectionError) {
      console.warn("Supabase connection failed:", connectionError.message)
      return false
    }

    // Create user if doesn't exist
    await createOrUpdateUser({
      full_name: "John Doe",
      email: DEMO_EMAIL,
      phone: "+1 (555) 123-4567",
      country: "us",
      bio: "Crypto enthusiast and investor since 2017.",
      profile_picture: "/images/user-logo.svg",
    })

    // Create default settings if don't exist
    const existingSettings = await getUserSettings()
    if (!existingSettings) {
      await saveUserSettings({
        theme: "light",
        color_scheme: "emerald",
        language: "english",
        currency: "usd",
        notifications: {
          email: true,
          push: true,
          sms: false,
          browser: true,
          priceAlerts: true,
          tradingAlerts: true,
          securityAlerts: true,
          marketNews: false,
        },
        security_settings: {
          loginNotifications: true,
          withdrawalConfirmation: true,
          apiAccess: false,
          sessionTimeout: "30",
        },
        two_factor_enabled: false,
        account_activity: true,
        trading_activity: true,
      })
    }

    // Create default payment methods if don't exist
    const existingPaymentMethods = await getPaymentMethods()
    if (existingPaymentMethods.length === 0) {
      await savePaymentMethods([
        {
          type: "bank",
          name: "Chase Bank ****1234",
          is_default: true,
          verified: true,
          added_date: "2023-10-15",
        },
        {
          type: "card",
          name: "Visa ****5678",
          is_default: false,
          verified: true,
          added_date: "2023-11-02",
        },
      ])
    }

    // Create default watchlist if doesn't exist
    const existingWatchlist = await getWatchlist()
    if (existingWatchlist.length === 0) {
      const defaultSymbols = ["BTC", "ETH", "BNB", "XRP", "ADA", "SOL", "DOGE", "DOT"]
      for (const symbol of defaultSymbols) {
        try {
          await saveWatchlistItem(symbol)
        } catch (error) {
          // Ignore duplicate errors
          console.log(`Symbol ${symbol} already in watchlist`)
        }
      }
    }

    return true
  } catch (error) {
    console.warn("Error initializing user data:", error)
    return false
  }
}
