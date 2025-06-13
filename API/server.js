const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const connectDB = require("./config/db")

// Load env vars FIRST - before anything else
dotenv.config({ path: "./config/.env" })

// Debug: Check if MONGO_URI is loaded
console.log("MONGO_URI loaded:", process.env.MONGO_URI ? "✅ Yes" : "❌ No")
console.log("Environment:", process.env.NODE_ENV)
console.log("JWT_SECRET loaded:", process.env.JWT_SECRET ? "✅ Yes" : "❌ No")

const app = express()

// Body parser
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Cookie parser
app.use(cookieParser())

// Enable CORS - Flexible for development
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true)

      // Allow any localhost origin during development
      if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
        return callback(null, true)
      }

      // For production, you'd be more restrictive here
      return callback(null, true)
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }),
)

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Basic route - test this first
app.get("/", (req, res) => {
  res.json({
    message: "Pettit API is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  })
})

// Health check route
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

// Connect to database
connectDB()

// Route files
const authRoutes = require("./routes/authRoutes")
app.use("/api/auth", authRoutes)
const postRoutes = require("./routes/postRoutes")
app.use("/api/posts", postRoutes)
const subredditRoutes = require("./routes/subredditRoutes")
app.use("/api/subreddits", subredditRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack)
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  })
})

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📍 Environment: ${process.env.NODE_ENV}`)
  console.log(`🌐 API URL: http://localhost:${PORT}`)
  console.log(`🔗 Test URL: http://localhost:${PORT}/health`)
})

// Handle server errors
server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use`)
    console.log("Try killing the process using the port:")
    console.log(`lsof -ti:${PORT} | xargs kill -9`)
  } else {
    console.error("❌ Server error:", error)
  }
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`❌ Unhandled Promise Rejection: ${err.message}`)
  server.close(() => {
    process.exit(1)
  })
})

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`❌ Uncaught Exception: ${err.message}`)
  process.exit(1)
})
