"use client"

import { createContext, useState, useEffect } from "react"
import axios from "axios"

export const AuthContext = createContext()

// Use environment variable or fallback to localhost
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Configure axios
  axios.defaults.baseURL = API_URL
  axios.defaults.timeout = 10000 // 10 second timeout

  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
  }

  // Add request interceptor for debugging
  axios.interceptors.request.use(
    (config) => {
      console.log("🚀 Making request to:", config.baseURL + config.url)
      console.log("📦 Request data:", config.data)
      return config
    },
    (error) => {
      console.error("❌ Request error:", error)
      return Promise.reject(error)
    },
  )

  // Add response interceptor for debugging
  axios.interceptors.response.use(
    (response) => {
      console.log("✅ Response received:", response.status, response.data)
      return response
    },
    (error) => {
      console.error("❌ Response error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        code: error.code,
      })

      // Handle different types of errors
      if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
        console.error("🔌 Cannot connect to API server. Make sure it's running on", API_URL)
      }

      return Promise.reject(error)
    },
  )

  // Test API connection
  const testConnection = async () => {
    try {
      console.log("🧪 Testing API connection...")
      const response = await axios.get("/../../health", { baseURL: "http://localhost:5000" })
      console.log("✅ API connection successful:", response.data)
      return true
    } catch (error) {
      console.error("❌ API connection failed:", error.message)
      return false
    }
  }

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true)
      setError(null)

      // Test connection first
      const isConnected = await testConnection()
      if (!isConnected) {
        throw new Error("Cannot connect to server. Please make sure the API server is running.")
      }

      console.log("📝 Attempting to register user:", userData.email)
      const res = await axios.post("/auth/register", userData)

      if (res.data.success) {
        localStorage.setItem("token", res.data.token)
        setToken(res.data.token)
        setUser(res.data.user)
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`
      }

      setLoading(false)
      return res.data
    } catch (err) {
      setLoading(false)
      console.error("❌ Registration error:", err)

      let errorMessage = "Registration failed. Please try again."

      if (err.code === "ERR_NETWORK") {
        errorMessage = "Cannot connect to server. Please check if the API server is running."
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.message) {
        errorMessage = err.message
      }

      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // Login user
  const login = async (userData) => {
    try {
      setLoading(true)
      setError(null)

      // Test connection first
      const isConnected = await testConnection()
      if (!isConnected) {
        throw new Error("Cannot connect to server. Please make sure the API server is running.")
      }

      console.log("🔐 Attempting to login user:", userData.email)
      const res = await axios.post("/auth/login", userData)

      if (res.data.success) {
        localStorage.setItem("token", res.data.token)
        setToken(res.data.token)
        setUser(res.data.user)
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`
      }

      setLoading(false)
      return res.data
    } catch (err) {
      setLoading(false)
      console.error("❌ Login error:", err)

      let errorMessage = "Login failed. Please try again."

      if (err.code === "ERR_NETWORK") {
        errorMessage = "Cannot connect to server. Please check if the API server is running."
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.message) {
        errorMessage = err.message
      }

      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // Logout user
  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
    delete axios.defaults.headers.common["Authorization"]
  }

  // Load user data
  const loadUser = async () => {
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const res = await axios.get("/auth/me")

      if (res.data.success) {
        setUser(res.data.user)
      }

      setLoading(false)
    } catch (err) {
      console.error("❌ Load user error:", err)
      localStorage.removeItem("token")
      setToken(null)
      setUser(null)
      setLoading(false)
    }
  }

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user
  }

  useEffect(() => {
    loadUser()
  }, [token])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
