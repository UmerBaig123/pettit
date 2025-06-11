const User = require("../models/User")
const jwt = require("jsonwebtoken")
const { validationResult } = require("express-validator")

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })
}

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    console.log("📝 Registration attempt received")
    console.log("📦 Request body:", req.body)

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log("❌ Validation errors:", errors.array())
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    const { username, email, password } = req.body

    console.log("🔍 Checking if user exists...")

    // Check if user already exists
    let user = await User.findOne({ email })

    if (user) {
      console.log("❌ User already exists with email:", email)
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      })
    }

    // Check if username is taken
    user = await User.findOne({ username })
    if (user) {
      console.log("❌ Username already taken:", username)
      return res.status(400).json({
        success: false,
        message: "Username is already taken",
      })
    }

    console.log("✅ User doesn't exist, creating new user...")

    // Create new user
    user = await User.create({
      username,
      email,
      password,
    })

    console.log("✅ User created successfully:", user._id)

    // Generate token
    const token = generateToken(user._id)

    console.log("✅ Token generated successfully")

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        karma: user.karma,
        isVerified: user.isVerified,
      },
    })

    console.log("✅ Registration successful for:", email)
  } catch (error) {
    console.error("❌ Registration error details:")
    console.error("Error message:", error.message)
    console.error("Error stack:", error.stack)
    console.error("Error name:", error.name)

    // Handle specific MongoDB errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message)
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: messages,
      })
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0]
      return res.status(400).json({
        success: false,
        message: `${field} already exists`,
      })
    }

    res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    })
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    console.log("🔐 Login attempt received")
    console.log("📦 Request body:", { email: req.body.email, password: "[HIDDEN]" })

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log("❌ Validation errors:", errors.array())
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ email }).select("+password")

    if (!user) {
      console.log("❌ User not found:", email)
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
      console.log("❌ Password mismatch for:", email)
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Generate token
    const token = generateToken(user._id)

    console.log("✅ Login successful for:", email)

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        karma: user.karma,
        isVerified: user.isVerified,
      },
    })
  } catch (error) {
    console.error("❌ Login error:", error)
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    })
  }
}

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
        karma: user.karma,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    console.error("❌ Get user error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}
