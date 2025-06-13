const mongoose = require("mongoose")

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Post title is required"],
      trim: true,
      maxlength: [300, "Title cannot be more than 300 characters"],
    },

    content: {
      type: String,
      required: [true, "Post content is required"],
      trim: true,
      maxlength: [10000, "Content cannot be more than 10000 characters"],
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    subreddit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subreddit",
      required: true,
    },

    media: [
      {
        type: {
          type: String,
          enum: ["image", "video", "link"],
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        caption: String,
      },
    ],

    tags: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],

    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    downvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    voteScore: {
      type: Number,
      default: 0,
    },

    commentCount: {
      type: Number,
      default: 0,
    },

    views: {
      type: Number,
      default: 0,
    },

    savedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },

    isPinned: {
      type: Boolean,
      default: false,
    },

    isLocked: {
      type: Boolean,
      default: false,
    },

    isSponsored: {
      type: Boolean,
      default: false,
    },

    isRemoved: {
      type: Boolean,
      default: false,
    },

    removedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    removedReason: String,

    reports: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        reason: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Indexes for better performance
postSchema.index({ user: 1 })
postSchema.index({ subreddit: 1 })
postSchema.index({ createdAt: -1 })
postSchema.index({ voteScore: -1 })
postSchema.index({ tags: 1 })
postSchema.index({ title: "text", content: "text" })

// Virtual for time ago
postSchema.virtual("timeAgo").get(function () {
  const now = new Date()
  const diff = now - this.createdAt
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return "just now"
})

// Pre-save middleware to update vote score
postSchema.pre("save", function (next) {
  this.voteScore = this.upvotes.length - this.downvotes.length
  next()
})

// Instance methods
postSchema.methods.upvote = async function (userId) {
  // Remove from downvotes if exists
  if (this.downvotes.includes(userId)) {
    this.downvotes = this.downvotes.filter((id) => !id.equals(userId))
  }

  // Toggle upvote
  if (this.upvotes.includes(userId)) {
    this.upvotes = this.upvotes.filter((id) => !id.equals(userId))
  } else {
    this.upvotes.push(userId)
  }

  this.voteScore = this.upvotes.length - this.downvotes.length
  return this.save()
}

postSchema.methods.downvote = async function (userId) {
  // Remove from upvotes if exists
  if (this.upvotes.includes(userId)) {
    this.upvotes = this.upvotes.filter((id) => !id.equals(userId))
  }

  // Toggle downvote
  if (this.downvotes.includes(userId)) {
    this.downvotes = this.downvotes.filter((id) => !id.equals(userId))
  } else {
    this.downvotes.push(userId)
  }

  this.voteScore = this.upvotes.length - this.downvotes.length
  return this.save()
}

postSchema.methods.toggleSave = async function (userId) {
  if (this.savedBy.includes(userId)) {
    this.savedBy = this.savedBy.filter((id) => !id.equals(userId))
  } else {
    this.savedBy.push(userId)
  }
  return this.save()
}

postSchema.methods.incrementViews = async function () {
  this.views += 1
  return this.save()
}

// Static methods
postSchema.statics.findBySubreddit = async function (subredditId, options = {}) {
  const { page = 1, limit = 10, sort = "new" } = options
  const skip = (page - 1) * limit

  let sortOption = {}
  switch (sort) {
    case "hot":
      sortOption = { voteScore: -1, createdAt: -1 }
      break
    case "top":
      sortOption = { voteScore: -1 }
      break
    case "new":
    default:
      sortOption = { createdAt: -1 }
      break
  }

  return this.find({
    subreddit: subredditId,
    isActive: true,
    isRemoved: false,
  })
    .populate("user", "username avatar verified")
    .populate("subreddit", "name displayName")
    .sort(sortOption)
    .skip(skip)
    .limit(limit)
}

postSchema.statics.findForFeed = async function (options = {}) {
  const { page = 1, limit = 10, sort = "new", userId } = options
  const skip = (page - 1) * limit

  let sortOption = {}
  switch (sort) {
    case "hot":
      sortOption = { voteScore: -1, createdAt: -1 }
      break
    case "top":
      sortOption = { voteScore: -1 }
      break
    case "new":
    default:
      sortOption = { createdAt: -1 }
      break
  }

  const query = {
    isActive: true,
    isRemoved: false,
  }

  return this.find(query)
    .populate("user", "username avatar verified")
    .populate("subreddit", "name displayName")
    .sort(sortOption)
    .skip(skip)
    .limit(limit)
}

postSchema.statics.findTrending = async function (timeframe = "24h", limit = 10) {
  const timeAgo = new Date()
  switch (timeframe) {
    case "1h":
      timeAgo.setHours(timeAgo.getHours() - 1)
      break
    case "24h":
      timeAgo.setDate(timeAgo.getDate() - 1)
      break
    case "7d":
      timeAgo.setDate(timeAgo.getDate() - 7)
      break
    default:
      timeAgo.setDate(timeAgo.getDate() - 1)
  }

  return this.find({
    createdAt: { $gte: timeAgo },
    isActive: true,
    isRemoved: false,
  })
    .populate("user", "username avatar verified")
    .populate("subreddit", "name displayName")
    .sort({ voteScore: -1, views: -1, commentCount: -1 })
    .limit(limit)
}

postSchema.statics.searchPosts = async function (searchTerm, options = {}) {
  const { page = 1, limit = 10 } = options
  const skip = (page - 1) * limit

  return this.find({
    $text: { $search: searchTerm },
    isActive: true,
    isRemoved: false,
  })
    .populate("user", "username avatar verified")
    .populate("subreddit", "name displayName")
    .sort({ score: { $meta: "textScore" } })
    .skip(skip)
    .limit(limit)
}

const Post = mongoose.model("Post", postSchema)

module.exports = Post
