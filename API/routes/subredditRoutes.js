const express = require("express")
const router = express.Router()
const Subreddit = require("../models/Subreddit")
const SubredditMember = require("../models/SubredditMember")
const { protect } = require("../middleware/auth")
const { body, validationResult } = require("express-validator")

// GET /api/subreddits - Get all subreddits with pagination and filtering
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 20, category, search, sort = "memberCount" } = req.query

    // Build query
    const query = { isActive: true }

    if (category && category !== "all") {
      query.category = category
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { displayName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ]
    }

    // Build sort option
    let sortOption = {}
    switch (sort) {
      case "newest":
        sortOption = { createdAt: -1 }
        break
      case "oldest":
        sortOption = { createdAt: 1 }
        break
      case "posts":
        sortOption = { postCount: -1 }
        break
      case "name":
        sortOption = { name: 1 }
        break
      case "memberCount":
      default:
        sortOption = { memberCount: -1 }
        break
    }

    const skip = (page - 1) * limit

    const subreddits = await Subreddit.find(query)
      .populate("creator", "username avatar verified")
      .sort(sortOption)
      .skip(skip)
      .limit(Number.parseInt(limit))
      .select("-__v")

    const total = await Subreddit.countDocuments(query)

    res.json({
      subreddits,
      pagination: {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Error fetching subreddits:", error)
    res.status(500).json({
      message: "Server error while fetching subreddits",
      error: error.message,
    })
  }
})

// GET /api/subreddits/popular - Get popular subreddits
router.get("/popular", async (req, res) => {
  try {
    const { limit = 10 } = req.query

    const popularSubreddits = await Subreddit.findPopular(Number.parseInt(limit))

    res.json(popularSubreddits)
  } catch (error) {
    console.error("Error fetching popular subreddits:", error)
    res.status(500).json({
      message: "Server error while fetching popular subreddits",
      error: error.message,
    })
  }
})

// GET /api/subreddits/categories - Get subreddits by category
router.get("/categories/:category", async (req, res) => {
  try {
    const { category } = req.params
    const { limit = 20 } = req.query

    const subreddits = await Subreddit.findByCategory(category, Number.parseInt(limit))

    res.json(subreddits)
  } catch (error) {
    console.error("Error fetching subreddits by category:", error)
    res.status(500).json({
      message: "Server error while fetching subreddits by category",
      error: error.message,
    })
  }
})

// GET /api/subreddits/:name - Get single subreddit by name
router.get("/:name", async (req, res) => {
  try {
    const { name } = req.params

    const subreddit = await Subreddit.findByName(name).populate("creator", "username avatar verified")

    if (!subreddit) {
      return res.status(404).json({
        message: "Subreddit not found",
      })
    }

    // Check if user is a member (if authenticated)
    let isMember = false
    let membershipInfo = null

    if (req.user) {
      membershipInfo = await SubredditMember.isMember(req.user.id, subreddit._id)
      isMember = !!membershipInfo
    }

    res.json({
      ...subreddit.toJSON(),
      isMember,
      membershipInfo,
    })
  } catch (error) {
    console.error("Error fetching subreddit:", error)
    res.status(500).json({
      message: "Server error while fetching subreddit",
      error: error.message,
    })
  }
})

// POST /api/subreddits - Create new subreddit
router.post("/", protect, [
    body("name")
      .isLength({ min: 3, max: 21 })
      .withMessage("Name must be between 3 and 21 characters")
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage("Name can only contain letters, numbers, and underscores"),
    body("displayName").isLength({ min: 1, max: 21 }).withMessage("Display name must be between 1 and 21 characters"),
    body("description").isLength({ min: 1, max: 500 }).withMessage("Description must be between 1 and 500 characters"),
    body("category").isIn([
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
    ]),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      const { name, displayName, description, category = "general", isPrivate = false } = req.body

      // Check if subreddit name already exists
      const existingSubreddit = await Subreddit.findByName(name)
      if (existingSubreddit) {
        return res.status(400).json({
          message: "A subreddit with this name already exists",
        })
      }

      // Create new subreddit
      const newSubreddit = new Subreddit({
        name: name.toLowerCase(),
        displayName,
        description,
        category,
        isPrivate,
        creator: req.user.id,
        memberCount: 1, // Creator is automatically a member
      })

      await newSubreddit.save()

      // Add creator as admin member
      await SubredditMember.addMember(req.user.id, newSubreddit._id, "admin")

      // Populate creator info
      await newSubreddit.populate("creator", "username avatar verified")

      res.status(201).json({
        message: "Subreddit created successfully",
        subreddit: newSubreddit,
      })
    } catch (error) {
      console.error("Error creating subreddit:", error)
      res.status(500).json({
        message: "Server error while creating subreddit",
        error: error.message,
      })
    }
  },
)

// PUT /api/subreddits/:name - Update subreddit
router.put(
  "/:name", protect,
  [
    body("displayName").optional().isLength({ min: 1, max: 21 }),
    body("description").optional().isLength({ min: 1, max: 500 }),
    body("category")
      .optional()
      .isIn([
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
      ]),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      const { name } = req.params
      const { displayName, description, category, isPrivate, imagePath } = req.body

      const subreddit = await Subreddit.findByName(name)
      if (!subreddit) {
        return res.status(404).json({
          message: "Subreddit not found",
        })
      }

      // Check if user is admin or creator
      const membership = await SubredditMember.findOne({
        user: req.user.id,
        subreddit: subreddit._id,
        role: { $in: ["admin", "moderator"] },
      })

      if (!membership && subreddit.creator.toString() !== req.user.id) {
        return res.status(403).json({
          message: "Not authorized to update this subreddit",
        })
      }

      // Update fields
      if (displayName) subreddit.displayName = displayName
      if (description) subreddit.description = description
      if (category) subreddit.category = category
      if (typeof isPrivate === "boolean") subreddit.isPrivate = isPrivate
      if (imagePath) subreddit.imagePath = imagePath

      await subreddit.save()
      await subreddit.populate("creator", "username avatar verified")

      res.json({
        message: "Subreddit updated successfully",
        subreddit,
      })
    } catch (error) {
      console.error("Error updating subreddit:", error)
      res.status(500).json({
        message: "Server error while updating subreddit",
        error: error.message,
      })
    }
  },
)

// POST /api/subreddits/:name/join - Join subreddit
router.post("/:name/join", protect, async (req, res) => {
  try {
    const { name } = req.params

    const subreddit = await Subreddit.findByName(name)
    if (!subreddit) {
      return res.status(404).json({
        message: "Subreddit not found",
      })
    }

    // Check if already a member
    const existingMembership = await SubredditMember.isMember(req.user.id, subreddit._id)
    if (existingMembership) {
      return res.status(400).json({
        message: "You are already a member of this subreddit",
      })
    }

    // Add member
    await SubredditMember.addMember(req.user.id, subreddit._id)

    res.json({
      message: "Successfully joined subreddit",
      isMember: true,
    })
  } catch (error) {
    console.error("Error joining subreddit:", error)
    res.status(500).json({
      message: "Server error while joining subreddit",
      error: error.message,
    })
  }
})

// POST /api/subreddits/:name/leave - Leave subreddit
router.post("/:name/leave", protect, async (req, res) => {
  try {
    const { name } = req.params

    const subreddit = await Subreddit.findByName(name)
    if (!subreddit) {
      return res.status(404).json({
        message: "Subreddit not found",
      })
    }

    // Check if user is the creator
    if (subreddit.creator.toString() === req.user.id) {
      return res.status(400).json({
        message: "Creator cannot leave their own subreddit",
      })
    }

    // Remove member
    const membership = await SubredditMember.removeMember(req.user.id, subreddit._id)
    if (!membership) {
      return res.status(400).json({
        message: "You are not a member of this subreddit",
      })
    }

    res.json({
      message: "Successfully left subreddit",
      isMember: false,
    })
  } catch (error) {
    console.error("Error leaving subreddit:", error)
    res.status(500).json({
      message: "Server error while leaving subreddit",
      error: error.message,
    })
  }
})

// GET /api/subreddits/:name/members - Get subreddit members
router.get("/:name/members", async (req, res) => {
  try {
    const { name } = req.params
    const { page = 1, limit = 20, role } = req.query

    const subreddit = await Subreddit.findByName(name)
    if (!subreddit) {
      return res.status(404).json({
        message: "Subreddit not found",
      })
    }

    const members = await SubredditMember.getMembersBySubreddit(subreddit._id, {
      page: Number.parseInt(page),
      limit: Number.parseInt(limit),
      role,
    })

    const total = await SubredditMember.countDocuments({
      subreddit: subreddit._id,
      isActive: true,
      ...(role && { role }),
    })

    res.json({
      members,
      pagination: {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Error fetching subreddit members:", error)
    res.status(500).json({
      message: "Server error while fetching members",
      error: error.message,
    })
  }
})

// DELETE /api/subreddits/:name - Delete subreddit (admin only)
router.delete("/:name", protect, async (req, res) => {
  try {
    const { name } = req.params

    const subreddit = await Subreddit.findByName(name)
    if (!subreddit) {
      return res.status(404).json({
        message: "Subreddit not found",
      })
    }

    // Only creator can delete subreddit
    if (subreddit.creator.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only the creator can delete this subreddit",
      })
    }

    // Soft delete - mark as inactive
    subreddit.isActive = false
    await subreddit.save()

    // Remove all memberships
    await SubredditMember.updateMany({ subreddit: subreddit._id }, { isActive: false })

    res.json({
      message: "Subreddit deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting subreddit:", error)
    res.status(500).json({
      message: "Server error while deleting subreddit",
      error: error.message,
    })
  }
})

// GET /api/subreddits/user/:userId - Get subreddits user is member of
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params
    const { page = 1, limit = 20 } = req.query

    const memberships = await SubredditMember.getSubredditsByUser(userId, {
      page: Number.parseInt(page),
      limit: Number.parseInt(limit),
    })

    const total = await SubredditMember.countDocuments({
      user: userId,
      isActive: true,
    })

    res.json({
      subreddits: memberships.map((membership) => ({
        ...membership.subreddit.toJSON(),
        membershipRole: membership.role,
        joinedAt: membership.joinedAt,
      })),
      pagination: {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Error fetching user subreddits:", error)
    res.status(500).json({
      message: "Server error while fetching user subreddits",
      error: error.message,
    })
  }
})

module.exports = router
