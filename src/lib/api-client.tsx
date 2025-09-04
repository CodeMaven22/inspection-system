import axios from "axios"
import type { AuthTokens } from "@/types/auth"
import { toast } from "sonner"

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api",
  timeout: 10000,
})

// Store reference to auth functions
let authContext: {
  getTokens: () => AuthTokens | null
  refreshToken: () => Promise<string | void>
  logout: () => void
} | null = null

// Initialize the api client with auth context
export const initializeApiClient = (auth: {
  getTokens: () => AuthTokens | null
  refreshToken: () => Promise<string | void>
  logout: () => void
}) => {
  authContext = auth
  setupInterceptors()
}

// Check if token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const now = Math.floor(Date.now() / 1000)
    return payload.exp < now
  } catch (error) {
    console.error("Error checking token expiration:", error)
    return true // Assume expired if we can't parse
  }
}

// Check if token is about to expire (within 30 seconds)
const isTokenExpiringSoon = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const now = Math.floor(Date.now() / 1000)
    return payload.exp - now < 30
  } catch (error) {
    console.error("Error checking token expiration:", error)
    return true // Assume expiring if we can't parse
  }
}

// Setup interceptors
const setupInterceptors = () => {
  // Request interceptor to add auth token
  api.interceptors.request.use(
    async (config) => {
      if (!authContext) return config

      const tokens = authContext.getTokens()
      
      if (tokens?.access) {
        // Check if token is expired or about to expire
        if (isTokenExpired(tokens.access)) {
          // Token is expired, try to refresh
          try {
            const newAccess = await authContext.refreshToken()
            if (newAccess) {
              config.headers.Authorization = `Bearer ${newAccess}`
            }
          } catch (error) {
            // Refresh failed, continue without auth header
            console.error("Token refresh failed:", error)
          }
        } else if (isTokenExpiringSoon(tokens.access)) {
          // Token is about to expire, refresh it proactively
          try {
            const newAccess = await authContext.refreshToken()
            if (newAccess) {
              config.headers.Authorization = `Bearer ${newAccess}`
            }
          } catch (error) {
            // Refresh failed, use current token
            config.headers.Authorization = `Bearer ${tokens.access}`
            console.error("Proactive token refresh failed:", error)
          }
        } else {
          // Token is valid, use it
          config.headers.Authorization = `Bearer ${tokens.access}`
        }
      }
      
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Response interceptor to handle auth errors
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (!authContext) return Promise.reject(error)

      const originalRequest = error.config
      
      // If error is 401 and we haven't already tried to refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true
        
        try {
          // Try to refresh the token
          const newAccess = await authContext.refreshToken()
          
          if (newAccess) {
            // Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${newAccess}`
            return api(originalRequest)
          }
        } catch (refreshError) {
          // If refresh fails, logout the user
          authContext.logout()
          return Promise.reject(refreshError)
        }
      }
      
      // If we get a 403, the user might not have permissions
      if (error.response?.status === 403) {
        console.error("Permission denied:", error.response.data)
        toast.error("You don't have permission to perform this action")
      }
      
      return Promise.reject(error)
    }
  )
}

export default api