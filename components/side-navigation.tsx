"use client"

import { Wallet, BarChart2, Settings, MessageSquare } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import { getUser } from "@/lib/supabase-api"

interface SideNavigationProps {
  onCloseMobile?: () => void
}

export default function SideNavigation({ onCloseMobile }: SideNavigationProps) {
  const pathname = usePathname()

  const [userProfile, setUserProfile] = useState<{ profilePicture?: string }>({})

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      const user = await getUser()
      if (user) {
        setUserProfile({ profilePicture: user.profile_picture })
      }
    } catch (error) {
      console.error("Failed to load user profile:", error)
      // Fallback to localStorage
      const savedSettings = localStorage.getItem("userSettings")
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings)
          if (settings.formData) {
            setUserProfile({ profilePicture: settings.formData.profilePicture })
          }
        } catch (error) {
          console.error("Failed to load user profile:", error)
        }
      }
    }
  }

  const handleClick = () => {
    if (onCloseMobile) {
      onCloseMobile()
    }
  }

  // Update the isActive function to check for the statistics and settings paths
  const isActive = (path: string) => {
    if (path === "/dashboard" && pathname === "/dashboard") {
      return true
    }
    if (path === "/statistics" && pathname === "/statistics") {
      return true
    }
    if (path === "/settings" && pathname === "/settings") {
      return true
    }
    if (path === "/chat" && pathname === "/chat") {
      return true
    }
    return pathname === path
  }

  return (
    <div className="w-full h-full flex flex-col bg-card text-card-foreground">
      <nav className="py-6 flex-1">
        <ul className="space-y-6">
          <li>
            <Link
              href="/dashboard"
              onClick={handleClick}
              className={`flex items-center w-full px-6 py-2 font-medium relative group transition-all duration-200 hover:bg-primary/10 active:bg-primary/20 rounded-md ${
                isActive("/dashboard") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div className="relative mr-3 flex items-center justify-center">
                <div
                  className={`absolute inset-0 bg-gradient-to-br from-primary to-primary/80 rounded-md opacity-${isActive("/dashboard") ? "20" : "0"} group-hover:opacity-30 transition-opacity duration-200`}
                ></div>
                <img
                  src="/images/user-logo.svg"
                  alt="Exchange Global Logo"
                  className="h-5 w-5 rounded-full object-cover"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = "none"
                    const parent = target.parentElement
                    if (parent) {
                      const fallbackDiv = document.createElement("div")
                      fallbackDiv.className =
                        "h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center"
                      fallbackDiv.innerHTML = `
                        <div class="grid grid-cols-2 gap-0.5 p-1">
                          <div class="h-1.5 w-1.5 bg-primary rounded-sm"></div>
                          <div class="h-1.5 w-1.5 bg-primary rounded-sm"></div>
                          <div class="h-1.5 w-1.5 bg-primary rounded-sm"></div>
                          <div class="h-1.5 w-1.5 bg-primary rounded-sm"></div>
                        </div>
                      `
                      parent.appendChild(fallbackDiv)
                    }
                  }}
                />
              </div>
              <span className="transition-all duration-200 group-hover:translate-x-1 group-active:translate-x-0">
                Exchange Global
              </span>
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-primary rounded-r transition-all duration-200 ${isActive("/dashboard") ? "h-4/5" : "group-hover:h-4/5"}`}
              ></span>
            </Link>
          </li>
          <li>
            <Link
              href="/wallet"
              onClick={handleClick}
              className={`flex items-center w-full px-6 py-2 font-medium relative group transition-all duration-200 hover:bg-primary/10 active:bg-primary/20 rounded-md ${
                isActive("/wallet") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Wallet className="h-5 w-5 mr-3 transition-transform duration-200 group-hover:scale-110 group-active:scale-95" />
              <span className="transition-all duration-200 group-hover:translate-x-1 group-active:translate-x-0">
                Wallet
              </span>
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-primary rounded-r transition-all duration-200 ${isActive("/wallet") ? "h-4/5" : "group-hover:h-4/5"}`}
              ></span>
            </Link>
          </li>
          <li>
            <Link
              href="/statistics"
              onClick={handleClick}
              className={`flex items-center w-full px-6 py-2 font-medium relative group transition-all duration-200 hover:bg-primary/10 active:bg-primary/20 rounded-md ${
                isActive("/statistics") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <BarChart2 className="h-5 w-5 mr-3 transition-transform duration-200 group-hover:scale-110 group-active:scale-95" />
              <span className="transition-all duration-200 group-hover:translate-x-1 group-active:translate-x-0">
                Statistics
              </span>
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-primary rounded-r transition-all duration-200 ${isActive("/statistics") ? "h-4/5" : "group-hover:h-4/5"}`}
              ></span>
            </Link>
          </li>
          <li>
            <Link
              href="/chat"
              onClick={handleClick}
              className={`flex items-center w-full px-6 py-2 font-medium relative group transition-all duration-200 hover:bg-primary/10 active:bg-primary/20 rounded-md ${
                isActive("/chat") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <MessageSquare className="h-5 w-5 mr-3 transition-transform duration-200 group-hover:scale-110 group-active:scale-95" />
              <span className="transition-all duration-200 group-hover:translate-x-1 group-active:translate-x-0">
                AI Chat
              </span>
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-primary rounded-r transition-all duration-200 ${isActive("/chat") ? "h-4/5" : "group-hover:h-4/5"}`}
              ></span>
            </Link>
          </li>
          <li>
            <Link
              href="/settings"
              onClick={handleClick}
              className={`flex items-center w-full px-6 py-2 font-medium relative group transition-all duration-200 hover:bg-primary/10 active:bg-primary/20 rounded-md ${
                isActive("/settings") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Settings className="h-5 w-5 mr-3 transition-transform duration-200 group-hover:scale-110 group-active:scale-95" />
              <span className="transition-all duration-200 group-hover:translate-x-1 group-active:translate-x-0">
                Settings
              </span>
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-primary rounded-r transition-all duration-200 ${isActive("/settings") ? "h-4/5" : "group-hover:h-4/5"}`}
              ></span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="px-6 py-6 border-t border-border mt-auto">
        <div className="flex items-center justify-center mb-3">
          <img
            src="/images/user-logo.svg"
            alt="Exchange Global Logo"
            className="h-12 w-12 rounded-full object-cover border-2 border-emerald-200 dark:border-emerald-700"
            crossOrigin="anonymous"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = "none"
              const parent = target.parentElement
              if (parent) {
                const fallbackDiv = document.createElement("div")
                fallbackDiv.className =
                  "h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center border-2 border-emerald-200 dark:border-emerald-700"
                fallbackDiv.innerHTML = `
                  <div class="grid grid-cols-2 gap-0.5 p-1">
                    <div class="h-1.5 w-1.5 bg-primary rounded-sm"></div>
                    <div class="h-1.5 w-1.5 bg-primary rounded-sm"></div>
                    <div class="h-1.5 w-1.5 bg-primary rounded-sm"></div>
                    <div class="h-1.5 w-1.5 bg-primary rounded-sm"></div>
                  </div>
                `
                parent.appendChild(fallbackDiv)
              }
            }}
          />
        </div>
        <div className="text-center">
          <span className="text-sm text-muted-foreground font-medium">Exchange Global</span>
        </div>
      </div>
    </div>
  )
}
