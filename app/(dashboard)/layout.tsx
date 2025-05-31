"use client"

import type React from "react"

import { useEffect, useState, Suspense, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import SideNavigation from "@/components/side-navigation"
import MobileSidebarToggle from "@/components/mobile-sidebar-toggle"
import { getUser } from "@/lib/supabase-api"
import { initializeApp } from "@/lib/init-data"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false)
  const [userProfile, setUserProfile] = useState<{ profilePicture?: string }>({})

  const notificationDropdownRef = useRef<HTMLDivElement>(null)

  // Check if user is logged in
  useEffect(() => {
    // Check for login status
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true" || document.cookie.includes("isLoggedIn=true")

    if (!isLoggedIn) {
      router.push("/login")
    } else {
      setIsLoading(false)
      // Initialize user data in Supabase only after component is mounted
      setTimeout(() => {
        initializeApp().catch((error) => {
          console.warn("Failed to initialize app:", error)
          // Continue without Supabase if it fails
        })
      }, 1000)
    }
  }, [router])

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("mobile-sidebar")
      const toggle = document.getElementById("mobile-sidebar-toggle")

      if (
        mobileSidebarOpen &&
        sidebar &&
        toggle &&
        !sidebar.contains(event.target as Node) &&
        !toggle.contains(event.target as Node)
      ) {
        setMobileSidebarOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [mobileSidebarOpen])

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [mobileSidebarOpen])

  // Close notification dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) {
        setNotificationDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-primary mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-4 text-lg font-medium text-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <div className="h-full w-full">
        <div className="bg-card shadow-lg h-full">
          {/* Header */}
          <header className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-4">
              <div id="mobile-sidebar-toggle">
                <MobileSidebarToggle onToggle={setMobileSidebarOpen} isOpen={mobileSidebarOpen} />
              </div>
              <div className="flex items-center space-x-3">
                <img
                  src="/images/user-logo.svg"
                  alt="Exchange Global Logo"
                  className="h-8 w-8 rounded-full object-cover border border-emerald-200 dark:border-emerald-700"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = "none"
                    const parent = target.parentElement
                    if (parent) {
                      const fallbackDiv = document.createElement("div")
                      fallbackDiv.className =
                        "h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center border border-emerald-200 dark:border-emerald-700"
                      fallbackDiv.innerHTML = `
                        <div class="grid grid-cols-2 gap-0.5 p-1">
                          <div class="h-1 w-1 bg-primary rounded-sm"></div>
                          <div class="h-1 w-1 bg-primary rounded-sm"></div>
                          <div class="h-1 w-1 bg-primary rounded-sm"></div>
                          <div class="h-1 w-1 bg-primary rounded-sm"></div>
                        </div>
                      `
                      parent.appendChild(fallbackDiv)
                    }
                  }}
                />
                <h1 className="text-primary font-bold text-xl">Exchange Global</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search here"
                  className="bg-muted rounded-full py-2 px-4 pr-10 text-sm w-64 sm:w-80"
                />
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>

              <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center dark:bg-emerald-900 overflow-hidden">
                {userProfile.profilePicture ? (
                  <img
                    src={userProfile.profilePicture || "/placeholder.svg"}
                    alt="Profile"
                    className="h-full w-full object-cover"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-0.5 p-1">
                    <div className="h-1 w-1 bg-primary rounded-sm"></div>
                    <div className="h-1 w-1 bg-primary rounded-sm"></div>
                    <div className="h-1 w-1 bg-primary rounded-sm"></div>
                    <div className="h-1 w-1 bg-primary rounded-sm"></div>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="flex h-[calc(100vh-73px)]">
            {/* Mobile Sidebar Overlay */}
            {mobileSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" />}

            {/* Sidebar */}
            <div
              id="mobile-sidebar"
              className={`${
                mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
              } fixed inset-y-0 left-0 z-30 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:w-[300px]`}
            >
              <SideNavigation onCloseMobile={() => setMobileSidebarOpen(false)} />
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto w-full">
              <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
