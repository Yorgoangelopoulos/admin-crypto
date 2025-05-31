"use client"

import { useState, useEffect } from "react"
import {
  Settings,
  User,
  Bell,
  Shield,
  Moon,
  Globe,
  CreditCard,
  Save,
  Check,
  Eye,
  EyeOff,
  AlertTriangle,
  Plus,
  Sun,
} from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import {
  saveUserSettings,
  getUserSettings,
  createOrUpdateUser,
  getUser,
  getPaymentMethods,
  savePaymentMethods,
} from "@/lib/supabase-api"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account")
  const { theme, setTheme, colorScheme, setColorScheme } = useTheme()
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    browser: true,
    priceAlerts: true,
    tradingAlerts: true,
    securityAlerts: true,
    marketNews: false,
  })
  const [language, setLanguage] = useState("english")
  const [currency, setCurrency] = useState("usd")
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [accountActivity, setAccountActivity] = useState(true)
  const [tradingActivity, setTradingActivity] = useState(true)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [isLoading, setIsLoading] = useState(true)

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
    loginNotifications: true,
    deviceManagement: true,
    sessionTimeout: "30", // minutes
    ipWhitelist: "",
    withdrawalConfirmation: true,
    apiAccess: false,
  })

  // Payment methods
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: "bank",
      name: "Chase Bank ****1234",
      isDefault: true,
      verified: true,
      addedDate: "2023-10-15",
    },
    {
      id: 2,
      type: "card",
      name: "Visa ****5678",
      isDefault: false,
      verified: true,
      addedDate: "2023-11-02",
    },
  ])

  // Form data states
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "us",
    bio: "",
    profilePicture: "/images/user-logo.svg",
  })

  // Load saved settings from Supabase
  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      setIsLoading(true)
      console.log("=== LOADING USER DATA ===")

      // Load user profile
      const user = await getUser()
      if (user) {
        const userData = {
          fullName: user.full_name || "",
          email: user.email || "",
          phone: user.phone || "",
          country: user.country || "us",
          bio: user.bio || "",
          profilePicture: user.profile_picture || "/images/user-logo.svg",
        }
        setFormData(userData)
        console.log("Loaded user profile:", userData)
      }

      // Load user settings
      const settings = await getUserSettings()
      if (settings) {
        console.log("Loaded settings from Supabase:", settings)

        if (settings.notifications) {
          setNotifications(settings.notifications)
          console.log("Set notifications:", settings.notifications)
        }
        if (settings.language) {
          setLanguage(settings.language)
          console.log("Set language:", settings.language)
        }
        if (settings.currency) {
          setCurrency(settings.currency)
          console.log("Set currency:", settings.currency)
        }
        if (settings.two_factor_enabled !== undefined) {
          setTwoFactorEnabled(settings.two_factor_enabled)
          console.log("Set two factor:", settings.two_factor_enabled)
        }
        if (settings.account_activity !== undefined) {
          setAccountActivity(settings.account_activity)
          console.log("Set account activity:", settings.account_activity)
        }
        if (settings.trading_activity !== undefined) {
          setTradingActivity(settings.trading_activity)
          console.log("Set trading activity:", settings.trading_activity)
        }
        if (settings.security_settings) {
          setSecuritySettings({ ...securitySettings, ...settings.security_settings })
          console.log("Set security settings:", settings.security_settings)
        }
      }

      // Load payment methods
      const methods = await getPaymentMethods()
      if (methods.length > 0) {
        const formattedMethods = methods.map((method) => ({
          id: Number.parseInt(method.id.slice(-8), 16),
          type: method.type,
          name: method.name,
          isDefault: method.is_default,
          verified: method.verified,
          addedDate: method.added_date,
        }))
        setPaymentMethods(formattedMethods)
        console.log("Loaded payment methods:", formattedMethods)
      }

      console.log("=== USER DATA LOADED SUCCESSFULLY ===")
    } catch (error) {
      console.error("Failed to load user data:", error)
      // Fallback to localStorage
      const savedSettings = localStorage.getItem("userSettings")
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings)
          console.log("Loading from localStorage fallback:", settings)

          if (settings.formData) {
            setFormData(settings.formData)
          }
          if (settings.notifications) {
            setNotifications(settings.notifications)
          }
          if (settings.language) {
            setLanguage(settings.language)
          }
          if (settings.currency) {
            setCurrency(settings.currency)
          }
          if (settings.twoFactorEnabled !== undefined) {
            setTwoFactorEnabled(settings.twoFactorEnabled)
          }
          if (settings.accountActivity !== undefined) {
            setAccountActivity(settings.accountActivity)
          }
          if (settings.tradingActivity !== undefined) {
            setTradingActivity(settings.tradingActivity)
          }
          if (settings.securitySettings) {
            setSecuritySettings({ ...securitySettings, ...settings.securitySettings })
          }
          if (settings.paymentMethods) {
            setPaymentMethods(settings.paymentMethods)
          }
        } catch (error) {
          console.error("Failed to load saved settings:", error)
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      }
      console.log("Form data changed:", field, value, newData)
      return newData
    })
  }

  const handleSecurityChange = (field: string, value: any) => {
    setSecuritySettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const addPaymentMethod = () => {
    const newMethod = {
      id: Date.now(),
      type: "card",
      name: "New Payment Method",
      isDefault: false,
      verified: false,
      addedDate: new Date().toISOString().split("T")[0],
    }
    setPaymentMethods([...paymentMethods, newMethod])
  }

  const removePaymentMethod = (id: number) => {
    setPaymentMethods(paymentMethods.filter((method) => method.id !== id))
  }

  const setDefaultPaymentMethod = (id: number) => {
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    )
  }

  const handleSaveSettings = async () => {
    setSaveStatus("saving")
    console.log("=== SAVE SETTINGS STARTED ===")
    console.log("Form Data:", formData)
    console.log("Theme:", theme)
    console.log("Color Scheme:", colorScheme)
    console.log("Notifications:", notifications)
    console.log("Two Factor:", twoFactorEnabled)

    try {
      // Save user profile
      const userResult = await createOrUpdateUser({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        bio: formData.bio,
        profile_picture: formData.profilePicture,
      })
      console.log("User profile saved:", userResult)

      // Save user settings
      const settingsResult = await saveUserSettings({
        theme,
        color_scheme: colorScheme,
        notifications,
        language,
        currency,
        two_factor_enabled: twoFactorEnabled,
        account_activity: accountActivity,
        trading_activity: tradingActivity,
        security_settings: securitySettings,
      })
      console.log("User settings saved:", settingsResult)

      // Save payment methods
      const methodsToSave = paymentMethods.map((method) => ({
        type: method.type,
        name: method.name,
        is_default: method.isDefault,
        verified: method.verified,
        added_date: method.addedDate,
      }))
      const paymentResult = await savePaymentMethods(methodsToSave)
      console.log("Payment methods saved:", paymentResult)

      setSaveStatus("saved")
      console.log("=== ALL SETTINGS SAVED SUCCESSFULLY ===")

      // Also save to localStorage as backup
      const settingsData = {
        theme,
        colorScheme,
        notifications,
        language,
        currency,
        twoFactorEnabled,
        accountActivity,
        tradingActivity,
        formData,
        securitySettings,
        paymentMethods,
        savedAt: new Date().toISOString(),
      }
      localStorage.setItem("userSettings", JSON.stringify(settingsData))
      console.log("Backup saved to localStorage")

      // Reset status after 3 seconds
      setTimeout(() => {
        setSaveStatus("idle")
      }, 3000)
    } catch (error) {
      console.error("=== SAVE ERROR ===", error)
      setSaveStatus("error")

      // Fallback to localStorage if Supabase fails
      try {
        const settingsData = {
          theme,
          colorScheme,
          notifications,
          language,
          currency,
          twoFactorEnabled,
          accountActivity,
          tradingActivity,
          formData,
          securitySettings,
          paymentMethods,
          savedAt: new Date().toISOString(),
        }
        localStorage.setItem("userSettings", JSON.stringify(settingsData))
        setSaveStatus("saved")
        console.log("Settings saved to localStorage as fallback")
      } catch (localError) {
        console.error("Failed to save to localStorage:", localError)
      }

      setTimeout(() => {
        setSaveStatus("idle")
      }, 3000)
    }
  }

  const getSaveButtonText = () => {
    switch (saveStatus) {
      case "saving":
        return "Saving..."
      case "saved":
        return "Saved!"
      case "error":
        return "Error - Try Again"
      default:
        return "Save Changes"
    }
  }

  const getSaveButtonIcon = () => {
    switch (saveStatus) {
      case "saving":
        return (
          <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )
      case "saved":
        return <Check className="h-4 w-4 mr-2" />
      default:
        return <Save className="h-4 w-4 mr-2" />
    }
  }

  if (isLoading) {
    return (
      <div className="p-4 bg-background min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 bg-background min-h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="bg-emerald-100 rounded-full p-2 mr-3 dark:bg-emerald-900">
            <Settings className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground text-sm">Manage your account preferences</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="font-medium text-foreground">Settings</h2>
            </div>
            <nav className="p-2">
              <button
                onClick={() => setActiveTab("account")}
                className={`flex items-center w-full px-3 py-2 rounded-md text-left ${
                  activeTab === "account" ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"
                }`}
              >
                <User className="h-4 w-4 mr-3" />
                <span>Account</span>
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`flex items-center w-full px-3 py-2 rounded-md text-left ${
                  activeTab === "notifications" ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"
                }`}
              >
                <Bell className="h-4 w-4 mr-3" />
                <span>Notifications</span>
              </button>
              <button
                onClick={() => setActiveTab("appearance")}
                className={`flex items-center w-full px-3 py-2 rounded-md text-left ${
                  activeTab === "appearance" ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"
                }`}
              >
                <Moon className="h-4 w-4 mr-3" />
                <span>Appearance</span>
              </button>
              <button
                onClick={() => setActiveTab("language")}
                className={`flex items-center w-full px-3 py-2 rounded-md text-left ${
                  activeTab === "language" ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"
                }`}
              >
                <Globe className="h-4 w-4 mr-3" />
                <span>Language & Region</span>
              </button>
              <button
                onClick={() => setActiveTab("payment")}
                className={`flex items-center w-full px-3 py-2 rounded-md text-left ${
                  activeTab === "payment" ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"
                }`}
              >
                <CreditCard className="h-4 w-4 mr-3" />
                <span>Payment Methods</span>
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`flex items-center w-full px-3 py-2 rounded-md text-left ${
                  activeTab === "security" ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"
                }`}
              >
                <Shield className="h-4 w-4 mr-3" />
                <span>Security</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-card rounded-lg border border-border p-6">
            {/* Account Settings */}
            {activeTab === "account" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-foreground">Account Settings</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Profile Picture</label>
                    <div className="flex items-center">
                      <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center dark:bg-emerald-900 overflow-hidden">
                        {formData.profilePicture ? (
                          <img
                            src={formData.profilePicture || "/placeholder.svg"}
                            alt="Profile"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                        )}
                      </div>
                      <div className="ml-5">
                        <button
                          type="button"
                          onClick={() => handleInputChange("profilePicture", "/images/user-logo.svg")}
                          className="bg-card border border-border rounded px-3 py-1 text-sm font-medium hover:bg-muted text-foreground"
                        >
                          Use Logo
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInputChange("profilePicture", "")}
                          className="ml-2 text-sm text-muted-foreground hover:text-foreground"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        className="w-full border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-card text-foreground"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="w-full border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-card text-foreground"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="w-full border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-card text-foreground"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-foreground mb-1">
                        Country
                      </label>
                      <select
                        id="country"
                        value={formData.country}
                        onChange={(e) => handleInputChange("country", e.target.value)}
                        className="w-full border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-card text-foreground"
                      >
                        <option value="us">United States</option>
                        <option value="ca">Canada</option>
                        <option value="uk">United Kingdom</option>
                        <option value="au">Australia</option>
                        <option value="de">Germany</option>
                        <option value="fr">France</option>
                        <option value="tr">Turkey</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-foreground mb-1">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      rows={3}
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      className="w-full border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-card text-foreground"
                      placeholder="Tell us about yourself"
                    />
                  </div>
                </div>
                <div className="pt-4 border-t border-border flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    disabled={saveStatus === "saving"}
                    className={`px-4 py-2 rounded-md font-medium flex items-center transition-colors ${
                      saveStatus === "saved"
                        ? "bg-emerald-600 text-white"
                        : saveStatus === "error"
                          ? "bg-red-600 text-white"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                    } ${saveStatus === "saving" ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {getSaveButtonIcon()}
                    {getSaveButtonText()}
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-foreground">Notification Settings</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="inline-flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={notifications.email}
                        onChange={(e) => handleNotificationChange("email", e.target.checked)}
                        className="rounded text-primary focus:ring-primary"
                      />
                      <span className="text-foreground">Receive email notifications</span>
                    </label>
                  </div>
                  <div>
                    <label className="inline-flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={notifications.push}
                        onChange={(e) => handleNotificationChange("push", e.target.checked)}
                        className="rounded text-primary focus:ring-primary"
                      />
                      <span className="text-foreground">Receive push notifications</span>
                    </label>
                  </div>
                  <div>
                    <label className="inline-flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={notifications.sms}
                        onChange={(e) => handleNotificationChange("sms", e.target.checked)}
                        className="rounded text-primary focus:ring-primary"
                      />
                      <span className="text-foreground">Receive SMS notifications</span>
                    </label>
                  </div>
                  <div>
                    <label className="inline-flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={notifications.browser}
                        onChange={(e) => handleNotificationChange("browser", e.target.checked)}
                        className="rounded text-primary focus:ring-primary"
                      />
                      <span className="text-foreground">Receive browser notifications</span>
                    </label>
                  </div>
                  <div>
                    <label className="inline-flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={notifications.priceAlerts}
                        onChange={(e) => handleNotificationChange("priceAlerts", e.target.checked)}
                        className="rounded text-primary focus:ring-primary"
                      />
                      <span className="text-foreground">Price Alerts</span>
                    </label>
                  </div>
                  <div>
                    <label className="inline-flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={notifications.tradingAlerts}
                        onChange={(e) => handleNotificationChange("tradingAlerts", e.target.checked)}
                        className="rounded text-primary focus:ring-primary"
                      />
                      <span className="text-foreground">Trading Alerts</span>
                    </label>
                  </div>
                  <div>
                    <label className="inline-flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={notifications.securityAlerts}
                        onChange={(e) => handleNotificationChange("securityAlerts", e.target.checked)}
                        className="rounded text-primary focus:ring-primary"
                      />
                      <span className="text-foreground">Security Alerts</span>
                    </label>
                  </div>
                  <div>
                    <label className="inline-flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={notifications.marketNews}
                        onChange={(e) => handleNotificationChange("marketNews", e.target.checked)}
                        className="rounded text-primary focus:ring-primary"
                      />
                      <span className="text-foreground">Market News</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    disabled={saveStatus === "saving"}
                    className={`px-4 py-2 rounded-md font-medium flex items-center transition-colors ${
                      saveStatus === "saved"
                        ? "bg-emerald-600 text-white"
                        : saveStatus === "error"
                          ? "bg-red-600 text-white"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                    } ${saveStatus === "saving" ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {getSaveButtonIcon()}
                    {getSaveButtonText()}
                  </button>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === "appearance" && (
              <div>
                <h2 className="text-lg font-bold mb-6 text-foreground">Appearance Settings</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3 text-foreground">Theme</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div
                        className={`border border-border rounded-lg p-4 cursor-pointer ${theme === "light" ? "ring-2 ring-primary" : ""}`}
                        onClick={() => setTheme("light")}
                      >
                        <div className="flex justify-between items-center mb-3">
                          <div className="font-medium text-foreground">Light</div>
                          <Sun className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div className="h-20 bg-white border border-border rounded-md"></div>
                      </div>
                      <div
                        className={`border border-border rounded-lg p-4 cursor-pointer ${theme === "dark" ? "ring-2 ring-primary" : ""}`}
                        onClick={() => setTheme("dark")}
                      >
                        <div className="flex justify-between items-center mb-3">
                          <div className="font-medium text-foreground">Dark</div>
                          <Moon className="h-5 w-5 text-foreground" />
                        </div>
                        <div className="h-20 bg-gray-900 rounded-md"></div>
                      </div>
                      <div
                        className={`border border-border rounded-lg p-4 cursor-pointer ${theme === "system" ? "ring-2 ring-primary" : ""}`}
                        onClick={() => setTheme("system")}
                      >
                        <div className="flex justify-between items-center mb-3">
                          <div className="font-medium text-foreground">System</div>
                          <div className="flex">
                            <Sun className="h-5 w-5 text-yellow-500" />
                            <span className="mx-1 text-foreground">/</span>
                            <Moon className="h-5 w-5 text-foreground" />
                          </div>
                        </div>
                        <div className="h-20 bg-gradient-to-r from-white to-gray-900 rounded-md"></div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3 text-foreground">Color Scheme</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div
                        className={`border border-border rounded-lg p-2 cursor-pointer ${colorScheme === "emerald" ? "ring-2 ring-primary" : ""}`}
                        onClick={() => setColorScheme("emerald")}
                      >
                        <div className="h-10 bg-emerald-500 rounded-md"></div>
                        <div className="text-center mt-2 text-sm font-medium text-foreground">Emerald</div>
                      </div>
                      <div
                        className={`border border-border rounded-lg p-2 cursor-pointer ${colorScheme === "blue" ? "ring-2 ring-primary" : ""}`}
                        onClick={() => setColorScheme("blue")}
                      >
                        <div className="h-10 bg-blue-500 rounded-md"></div>
                        <div className="text-center mt-2 text-sm font-medium text-foreground">Blue</div>
                      </div>
                      <div
                        className={`border border-border rounded-lg p-2 cursor-pointer ${colorScheme === "purple" ? "ring-2 ring-primary" : ""}`}
                        onClick={() => setColorScheme("purple")}
                      >
                        <div className="h-10 bg-purple-500 rounded-md"></div>
                        <div className="text-center mt-2 text-sm font-medium text-foreground">Purple</div>
                      </div>
                      <div
                        className={`border border-border rounded-lg p-2 cursor-pointer ${colorScheme === "orange" ? "ring-2 ring-primary" : ""}`}
                        onClick={() => setColorScheme("orange")}
                      >
                        <div className="h-10 bg-orange-500 rounded-md"></div>
                        <div className="text-center mt-2 text-sm font-medium text-foreground">Orange</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border flex justify-end">
                    <button
                      onClick={handleSaveSettings}
                      disabled={saveStatus === "saving"}
                      className={`px-4 py-2 rounded-md font-medium flex items-center transition-colors ${
                        saveStatus === "saved"
                          ? "bg-emerald-600 text-white"
                          : saveStatus === "error"
                            ? "bg-red-600 text-white"
                            : "bg-primary text-primary-foreground hover:bg-primary/90"
                      } ${saveStatus === "saving" ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                      {getSaveButtonIcon()}
                      {getSaveButtonText()}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Language & Region Settings */}
            {activeTab === "language" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-foreground">Language & Region</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-foreground mb-1">
                      Language
                    </label>
                    <select
                      id="language"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-card text-foreground"
                    >
                      <option value="english">English</option>
                      <option value="spanish">Spanish</option>
                      <option value="french">French</option>
                      <option value="german">German</option>
                      <option value="turkish">Turkish</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-foreground mb-1">
                      Currency
                    </label>
                    <select
                      id="currency"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-card text-foreground"
                    >
                      <option value="usd">USD</option>
                      <option value="eur">EUR</option>
                      <option value="gbp">GBP</option>
                      <option value="try">TRY</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    disabled={saveStatus === "saving"}
                    className={`px-4 py-2 rounded-md font-medium flex items-center transition-colors ${
                      saveStatus === "saved"
                        ? "bg-emerald-600 text-white"
                        : saveStatus === "error"
                          ? "bg-red-600 text-white"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                    } ${saveStatus === "saving" ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {getSaveButtonIcon()}
                    {getSaveButtonText()}
                  </button>
                </div>
              </div>
            )}

            {/* Payment Methods Settings */}
            {activeTab === "payment" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-foreground">Payment Methods</h2>
                </div>

                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="bg-muted rounded-md p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-foreground">{method.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {method.type === "bank" ? "Bank Account" : "Credit Card"} - Added on {method.addedDate}
                        </div>
                        {method.verified ? (
                          <div className="text-sm text-emerald-600 flex items-center">
                            <Check className="h-4 w-4 mr-1" />
                            Verified
                          </div>
                        ) : (
                          <div className="text-sm text-red-600 flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            Not Verified
                          </div>
                        )}
                        {method.isDefault && <div className="text-sm text-primary">Default Payment Method</div>}
                      </div>
                      <div className="flex items-center space-x-2">
                        {!method.isDefault && (
                          <button
                            onClick={() => setDefaultPaymentMethod(method.id)}
                            className="px-3 py-1 rounded-md text-sm font-medium bg-card hover:bg-muted text-foreground"
                          >
                            Set as Default
                          </button>
                        )}
                        <button
                          onClick={() => removePaymentMethod(method.id)}
                          className="px-3 py-1 rounded-md text-sm font-medium bg-card hover:bg-muted text-foreground"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={addPaymentMethod}
                    className="flex items-center px-4 py-2 rounded-md font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </button>
                </div>

                <div className="pt-4 border-t border-border flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    disabled={saveStatus === "saving"}
                    className={`px-4 py-2 rounded-md font-medium flex items-center transition-colors ${
                      saveStatus === "saved"
                        ? "bg-emerald-600 text-white"
                        : saveStatus === "error"
                          ? "bg-red-600 text-white"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                    } ${saveStatus === "saving" ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {getSaveButtonIcon()}
                    {getSaveButtonText()}
                  </button>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-foreground">Security Settings</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Change Password</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-foreground mb-1">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={securitySettings.showCurrentPassword ? "text" : "password"}
                            id="currentPassword"
                            value={securitySettings.currentPassword}
                            onChange={(e) => handleSecurityChange("currentPassword", e.target.value)}
                            className="w-full border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-card text-foreground"
                            placeholder="Enter your current password"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleSecurityChange("showCurrentPassword", !securitySettings.showCurrentPassword)
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {securitySettings.showCurrentPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-foreground mb-1">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={securitySettings.showNewPassword ? "text" : "password"}
                            id="newPassword"
                            value={securitySettings.newPassword}
                            onChange={(e) => handleSecurityChange("newPassword", e.target.value)}
                            className="w-full border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-card text-foreground"
                            placeholder="Enter your new password"
                          />
                          <button
                            type="button"
                            onClick={() => handleSecurityChange("showNewPassword", !securitySettings.showNewPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {securitySettings.showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            type={securitySettings.showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            value={securitySettings.confirmPassword}
                            onChange={(e) => handleSecurityChange("confirmPassword", e.target.value)}
                            className="w-full border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-card text-foreground"
                            placeholder="Confirm your new password"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleSecurityChange("showConfirmPassword", !securitySettings.showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {securitySettings.showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Two-Factor Authentication</label>
                    <div className="flex items-center justify-between">
                      <span className="text-foreground">Enable two-factor authentication for added security</span>
                      <label className="inline-flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={twoFactorEnabled}
                          onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                          className="rounded text-primary focus:ring-primary"
                        />
                        <span className="text-foreground">{twoFactorEnabled ? "Enabled" : "Disabled"}</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Login Notifications</label>
                    <div className="flex items-center justify-between">
                      <span className="text-foreground">
                        Receive notifications when a new device logs into your account
                      </span>
                      <label className="inline-flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={securitySettings.loginNotifications}
                          onChange={(e) => handleSecurityChange("loginNotifications", e.target.checked)}
                          className="rounded text-primary focus:ring-primary"
                        />
                        <span className="text-foreground">
                          {securitySettings.loginNotifications ? "Enabled" : "Disabled"}
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="sessionTimeout" className="block text-sm font-medium text-foreground mb-1">
                      Session Timeout (minutes)
                    </label>
                    <select
                      id="sessionTimeout"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => handleSecurityChange("sessionTimeout", e.target.value)}
                      className="w-full border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-card text-foreground"
                    >
                      <option value="5">5 minutes</option>
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    disabled={saveStatus === "saving"}
                    className={`px-4 py-2 rounded-md font-medium flex items-center transition-colors ${
                      saveStatus === "saved"
                        ? "bg-emerald-600 text-white"
                        : saveStatus === "error"
                          ? "bg-red-600 text-white"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                    } ${saveStatus === "saving" ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {getSaveButtonIcon()}
                    {getSaveButtonText()}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
