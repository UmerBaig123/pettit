const mongoose = require("mongoose")

const subredditMemberSchema = new mongoose.Schema(
  {
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

    role: {
      type: String,
      enum: ["member", "moderator", "admin"],
      default: "member",
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // Moderator permissions (only applicable if role is moderator or admin)
    permissions: {
      canManagePosts: {
        type: Boolean,
        default: false,
      },
      canManageComments: {
        type: Boolean,
        default: false,
      },
      canManageUsers: {
        type: Boolean,
        default: false,
      },
      canManageSettings: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  },
)

// Compound index to ensure unique user-subreddit pairs
subredditMemberSchema.index({ user: 1, subreddit: 1 }, { unique: true })

// Indexes for better performance
subredditMemberSchema.index({ user: 1 })
subredditMemberSchema.index({ subreddit: 1 })
subredditMemberSchema.index({ role: 1 })
subredditMemberSchema.index({ joinedAt: -1 })

// Static methods
subredditMemberSchema.statics.addMember = async function (userId, subredditId, role = "member") {
  try {
    const membership = new this({
      user: userId,
      subreddit: subredditId,
      role: role,
    })

    // Set default permissions based on role
    if (role === "moderator") {
      membership.permissions = {
        canManagePosts: true,
        canManageComments: true,
        canManageUsers: false,
        canManageSettings: false,
      }
    } else if (role === "admin") {
      membership.permissions = {
        canManagePosts: true,
        canManageComments: true,
        canManageUsers: true,
        canManageSettings: true,
      }
    }

    await membership.save()

    // Update subreddit member count
    await mongoose.model("Subreddit").findByIdAndUpdate(subredditId, { $inc: { memberCount: 1 } })

    return membership
  } catch (error) {
    if (error.code === 11000) {
      throw new Error("User is already a member of this subreddit")
    }
    throw error
  }
}

subredditMemberSchema.statics.removeMember = async function (userId, subredditId) {
  const membership = await this.findOneAndDelete({
    user: userId,
    subreddit: subredditId,
  })

  if (membership) {
    // Update subreddit member count
    await mongoose.model("Subreddit").findByIdAndUpdate(subredditId, { $inc: { memberCount: -1 } })
  }

  return membership
}

subredditMemberSchema.statics.isMember = function (userId, subredditId) {
  return this.findOne({
    user: userId,
    subreddit: subredditId,
    isActive: true,
  })
}

subredditMemberSchema.statics.getMembersBySubreddit = function (subredditId, options = {}) {
  const { page = 1, limit = 20, role } = options
  const skip = (page - 1) * limit

  const query = { subreddit: subredditId, isActive: true }
  if (role) {
    query.role = role
  }

  return this.find(query)
    .populate("user", "username avatar verified")
    .sort({ joinedAt: -1 })
    .skip(skip)
    .limit(limit)
}

subredditMemberSchema.statics.getSubredditsByUser = function (userId, options = {}) {
  const { page = 1, limit = 20 } = options
  const skip = (page - 1) * limit

  return this.find({ user: userId, isActive: true })
    .populate("subreddit", "name displayName description imagePath memberCount category")
    .sort({ joinedAt: -1 })
    .skip(skip)
    .limit(limit)
}

subredditMemberSchema.statics.updateMemberRole = async function (userId, subredditId, newRole, permissions = {}) {
  const membership = await this.findOne({
    user: userId,
    subreddit: subredditId,
    isActive: true,
  })

  if (!membership) {
    throw new Error("Membership not found")
  }

  membership.role = newRole

  // Update permissions if provided
  if (Object.keys(permissions).length > 0) {
    membership.permissions = {
      ...membership.permissions,
      ...permissions,
    }
  }

  return membership.save()
}

subredditMemberSchema.statics.countMembersBySubreddit = function (subredditId, role) {
  const query = { subreddit: subredditId, isActive: true }
  if (role) {
    query.role = role
  }
  return this.countDocuments(query)
}

module.exports = mongoose.model("SubredditMember", subredditMemberSchema)