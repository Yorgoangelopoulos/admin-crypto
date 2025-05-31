import { initializeUserData } from "./supabase-api"

// Bu fonksiyonu uygulama başlatıldığında çağırın
export async function initializeApp() {
  try {
    console.log("Initializing user data...")

    // Only try to initialize if we're in the browser and not on login/register pages
    if (typeof window === "undefined") {
      console.log("Server-side rendering, skipping initialization")
      return false
    }

    // Check if we're on login or register pages
    const currentPath = window.location.pathname
    if (currentPath.includes("/login") || currentPath.includes("/register")) {
      console.log("On auth page, skipping Supabase initialization")
      return false
    }

    // Check if user is logged in
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true" || document.cookie.includes("isLoggedIn=true")

    if (!isLoggedIn) {
      console.log("User not logged in, skipping initialization")
      return false
    }

    const success = await initializeUserData()
    if (success) {
      console.log("User data initialized successfully")
    } else {
      console.log("Failed to initialize user data, using fallback")
    }
    return success
  } catch (error) {
    console.warn("Error initializing app:", error)
    return false
  }
}

// Sadece dashboard sayfalarında çalıştır
if (typeof window !== "undefined") {
  // Wait for the page to load before initializing
  window.addEventListener("load", () => {
    const currentPath = window.location.pathname
    if (
      currentPath.includes("/dashboard") ||
      currentPath.includes("/wallet") ||
      currentPath.includes("/statistics") ||
      currentPath.includes("/settings")
    ) {
      initializeApp()
    }
  })
}
