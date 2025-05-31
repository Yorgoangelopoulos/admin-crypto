"use client"

import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/contexts/theme-context"
import { useEffect } from "react"

const inter = Inter({ subsets: ["latin"] })

// Global error handler for ResizeObserver
function useResizeObserverErrorHandler() {
  useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      if (e.message === "ResizeObserver loop completed with undelivered notifications.") {
        const resizeObserverErrDiv = document.getElementById("webpack-dev-server-client-overlay-div")
        const resizeObserverErr = document.getElementById("webpack-dev-server-client-overlay")
        if (resizeObserverErr) {
          resizeObserverErr.setAttribute("style", "display: none")
        }
        if (resizeObserverErrDiv) {
          resizeObserverErrDiv.setAttribute("style", "display: none")
        }
        e.stopImmediatePropagation()
        e.preventDefault()
        return false
      }
      return true
    }

    const handleUnhandledRejection = (e: PromiseRejectionEvent) => {
      if (e.reason?.message?.includes("ResizeObserver loop completed")) {
        e.preventDefault()
        return false
      }
      return true
    }

    window.addEventListener("error", handleError)
    window.addEventListener("unhandledrejection", handleUnhandledRejection)

    // Also handle ResizeObserver errors directly
    const originalResizeObserver = window.ResizeObserver
    window.ResizeObserver = class extends originalResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        const wrappedCallback: ResizeObserverCallback = (entries, observer) => {
          try {
            callback(entries, observer)
          } catch (error) {
            // Silently ignore ResizeObserver errors
            if (error instanceof Error && error.message.includes("ResizeObserver loop completed")) {
              return
            }
            throw error
          }
        }
        super(wrappedCallback)
      }
    }

    return () => {
      window.addEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
      window.ResizeObserver = originalResizeObserver
    }
  }, [])
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useResizeObserverErrorHandler()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
