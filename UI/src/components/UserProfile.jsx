"use client"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { User, Settings, LogOut, Heart, Award, BookOpen } from "lucide-react"
import { useNavigate } from "react-router-dom"

export const UserProfile = () => {
  const { user, logout } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  if (!user) return null

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg transition-colors"
        onClick={() => setShowDropdown(!showDropdown)}
        aria-expanded={showDropdown}
        aria-haspopup="true"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-rose-500 rounded-full flex items-center justify-center text-white">
          {user.profilePicture ? (
            <img
              src={user.profilePicture || "/placeholder.svg"}
              alt={user.username}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User className="w-4 h-4" />
          )}
        </div>
        <span className="text-sm font-medium hidden md:block">{user.username}</span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-rose-500 rounded-full flex items-center justify-center text-white">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture || "/placeholder.svg"}
                    alt={user.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6" />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{user.username}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <div className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <Award className="w-3 h-3" />
                <span>{user.karma || 0} karma</span>
              </div>
              {user.isVerified && (
                <div className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium">Verified</div>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              onClick={() => navigate("/profile")}
            >
              <User className="w-4 h-4" />
              My Profile
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              onClick={() => navigate("/saved")}
            >
              <Heart className="w-4 h-4" />
              Saved Posts
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              onClick={() => navigate("/my-posts")}
            >
              <BookOpen className="w-4 h-4" />
              My Posts
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              onClick={() => navigate("/settings")}
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 mt-1 pt-1">
            <button
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}