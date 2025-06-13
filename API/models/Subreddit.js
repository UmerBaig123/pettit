const mongoose = require("mongoose")

const subredditSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 21,
      match: /^[a-zA-Z0-9_]+$/, // Only alphanumeric and underscores
      lowercase: true,
    },

    displayName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 21,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    imagePath: {
      type: String,
      trim: true,
      default: "",
    },

    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    memberCount: {
      type: Number,
      default: 0,
    },

    postCount: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isPrivate: {
      type: Boolean,
      default: false,
    },

    category: {
      type: String,
      enum: [
        "general",
        "pets",
        "dogs",
        "cats",
        "birds",
        "fish",
        "reptiles",
        "small-pets",
        "exotic-pets",
        "pet-care",
        "training",
        "health",
        "adoption",
        "other",
      ],
      default: "general",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Indexes for better performance
subredditSchema.index({ name: 1 })
subredditSchema.index({ creator: 1 })
subredditSchema.index({ category: 1 })
subredditSchema.index({ memberCount: -1 })
subredditSchema.index({ createdAt: -1 })

// Virtual for formatted member count
subredditSchema.virtual("formattedMemberCount").get(function () {
  if (this.memberCount >= 1000000) {
    return (this.memberCount / 1000000).toFixed(1) + "M"
  } else if (this.memberCount >= 1000) {
    return (this.memberCount / 1000).toFixed(1) + "K"
  }
  return this.memberCount.toString()
})

// Static methods
subredditSchema.statics.findByName = function (name) {
  return this.findOne({ name: name.toLowerCase() })
}

subredditSchema.statics.findPopular = function (limit = 10) {
  return this.find({ isActive: true })
    .sort({ memberCount: -1 })
    .limit(limit)
    .populate("creator", "username")
    .select("-__v")
}

subredditSchema.statics.findByCategory = function (category, limit = 20) {
  return this.find({
    category: category,
    isActive: true,
  })
    .sort({ memberCount: -1 })
    .limit(limit)
    .populate("creator", "username")
    .select("-__v")
}

module.exports = mongoose.model("Subreddit", subredditSchema)
