"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import {
  Heart,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Github,
  Chrome,
  PawPrint,
  Users,
  MessageCircle,
  ShoppingBag,
  BookOpen,
  Star,
  ArrowRight,
  AlertCircle,
} from "lucide-react"

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("")

    try {
      await login({ email, password })
      navigate("/fyp")
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to login. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = () => {
    navigate("/forgot-password")
  }

  const handleSignUp = () => {
    navigate("/register")
  }

  const features = [
    { icon: BookOpen, title: "Pet Stories", desc: "Share your journey" },
    { icon: Users, title: "Communities", desc: "Connect with lovers" },
    { icon: ShoppingBag, title: "Marketplace", desc: "Buy & sell items" },
    { icon: MessageCircle, title: "Chat", desc: "Real-time talks" },
  ]

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* Custom Pet-themed Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-rose-50 to-violet-100">
        {/* Paw Print Pattern Background */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern id="pawprints" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                <g transform="translate(20,20)">
                  <ellipse cx="15" cy="25" rx="8" ry="12" fill="currentColor" opacity="0.3" />
                  <circle cx="8" cy="8" r="4" fill="currentColor" opacity="0.4" />
                  <circle cx="22" cy="8" r="4" fill="currentColor" opacity="0.4" />
                  <circle cx="5" cy="18" r="3" fill="currentColor" opacity="0.4" />
                  <circle cx="25" cy="18" r="3" fill="currentColor" opacity="0.4" />
                </g>
                <g transform="translate(70,70) rotate(45)">
                  <ellipse cx="15" cy="25" rx="6" ry="10" fill="currentColor" opacity="0.2" />
                  <circle cx="8" cy="8" r="3" fill="currentColor" opacity="0.3" />
                  <circle cx="22" cy="8" r="3" fill="currentColor" opacity="0.3" />
                  <circle cx="5" cy="18" r="2.5" fill="currentColor" opacity="0.3" />
                  <circle cx="25" cy="18" r="2.5" fill="currentColor" opacity="0.3" />
                </g>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pawprints)" className="text-orange-400" />
          </svg>
        </div>

        {/* Floating Geometric Shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-16 left-16 w-48 h-48 bg-gradient-to-br from-orange-200/20 to-rose-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-violet-200/25 to-purple-200/25 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-20 w-56 h-56 bg-gradient-to-br from-amber-200/15 to-orange-200/15 rounded-full blur-3xl animate-pulse delay-2000"></div>
          <div className="absolute bottom-16 right-16 w-40 h-40 bg-gradient-to-br from-rose-200/20 to-pink-200/20 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        {/* Floating Pet Icons with Animation */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-12 left-12 text-2xl opacity-10 animate-bounce" style={{ animationDelay: "0s" }}>
            🐕
          </div>
          <div className="absolute top-20 right-16 text-xl opacity-8 animate-bounce" style={{ animationDelay: "0.5s" }}>
            🐱
          </div>
          <div className="absolute top-1/2 left-1/4 text-xl opacity-10 animate-bounce" style={{ animationDelay: "1s" }}>
            🐰
          </div>
          <div
            className="absolute bottom-24 left-16 text-xl opacity-8 animate-bounce"
            style={{ animationDelay: "1.5s" }}
          >
            🐦
          </div>
          <div
            className="absolute bottom-16 right-20 text-lg opacity-10 animate-bounce"
            style={{ animationDelay: "2s" }}
          >
            🐹
          </div>
          <div
            className="absolute top-1/4 right-1/4 text-xl opacity-8 animate-bounce"
            style={{ animationDelay: "2.5s" }}
          >
            🐢
          </div>
        </div>
      </div>

      <div className="flex h-screen w-full relative z-10">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-8">
          <div className="max-w-md">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                  <PawPrint className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-violet-400 rounded-full animate-ping"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
                  Pettit
                </h1>
                <p className="text-xs text-gray-600">Pet Community Platform</p>
              </div>
            </div>

            {/* Hero Text */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-3 leading-tight">
                Welcome back to your
                <span className="bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                  {" "}
                  pawsome{" "}
                </span>
                community
              </h2>
              <p className="text-gray-700 text-base leading-relaxed">
                Connect with fellow pet lovers, share stories, discover amazing products, and build lasting friendships.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {features.map((feature, index) => (
                <div key={index} className="group">
                  <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-white/30 hover:bg-white/90 transition-all duration-300 hover:scale-105 shadow-lg">
                    <feature.icon className="w-5 h-5 text-orange-500 mb-1 group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold text-gray-800 text-xs">{feature.title}</h3>
                    <p className="text-xs text-gray-600">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-rose-400 rounded-full border-2 border-white shadow-sm"></div>
                  <div className="w-6 h-6 bg-gradient-to-br from-violet-400 to-purple-400 rounded-full border-2 border-white shadow-sm"></div>
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full border-2 border-white shadow-sm"></div>
                </div>
                <span className="text-xs text-gray-700 font-medium">50K+ pet lovers</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-xs font-medium text-gray-800">4.9</span>
                <span className="text-xs text-gray-600">(2.1k)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-sm">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-6">
              <div className="inline-flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-rose-500 rounded-xl flex items-center justify-center">
                  <PawPrint className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
                  Pettit
                </h1>
              </div>
              <p className="text-gray-700 text-sm">Welcome back to your pawsome community!</p>
            </div>

            {/* Login Card */}
            <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl border-0 p-6">
              {/* Header */}
              <div className="mb-5">
                <h2 className="text-xl font-bold text-gray-800 mb-1">Sign in</h2>
                <p className="text-gray-600 text-sm">Enter your credentials to access your account</p>
              </div>

              {/* Social Login */}
              <div className="space-y-2 mb-5">
                <button
                  type="button"
                  className="w-full h-10 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center justify-center gap-2 font-medium text-gray-700 text-sm"
                  onClick={() => console.log("Google login")}
                >
                  <Chrome className="w-4 h-4" />
                  Continue with Google
                </button>
                <button
                  type="button"
                  className="w-full h-10 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center justify-center gap-2 font-medium text-gray-700 text-sm"
                  onClick={() => console.log("GitHub login")}
                >
                  <Github className="w-4 h-4" />
                  Continue with GitHub
                </button>
              </div>

              {/* Divider */}
              <div className="relative mb-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-gray-500 font-medium">Or continue with email</span>
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errorMessage}
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="email" className="block text-gray-700 font-medium text-xs">
                    Email address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 h-10 border border-gray-200 rounded-lg focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all duration-200 outline-none text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="password" className="block text-gray-700 font-medium text-xs">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 h-10 border border-gray-200 rounded-lg focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all duration-200 outline-none text-sm"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 flex items-center justify-center hover:bg-gray-100 rounded-md transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-3 w-3 text-gray-400" />
                      ) : (
                        <Eye className="h-3 w-3 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      id="remember"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-3 w-3 text-orange-500 border-gray-300 rounded focus:ring-orange-400"
                    />
                    <label htmlFor="remember" className="text-xs text-gray-600 font-medium">
                      Remember me
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs text-orange-600 hover:text-orange-700 font-medium hover:underline transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group text-sm disabled:opacity-70"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Sign in to Pettit
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-5 pt-4 border-t border-gray-200">
                <div className="text-center mb-3">
                  <span className="text-gray-600 text-xs">{"Don't have an account? "}</span>
                  <button
                    onClick={handleSignUp}
                    className="text-orange-600 hover:text-orange-700 font-semibold hover:underline transition-colors text-xs"
                  >
                    Join the pack →
                  </button>
                </div>

                <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                  <span>Made with</span>
                  <Heart className="w-2 h-2 text-red-500 fill-current animate-pulse" />
                  <span>for pet lovers worldwide</span>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-4 flex items-center justify-center gap-3">
              <div className="bg-green-100 text-green-700 border border-green-200 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                Secure & Private
              </div>
              <div className="bg-blue-100 text-blue-700 border border-blue-200 px-2 py-1 rounded-full text-xs font-medium">
                24/7 Support
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
