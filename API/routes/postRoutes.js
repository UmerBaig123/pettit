const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const Subreddit = require("../models/Subreddit");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { protect } = require("../middleware/auth");

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../uploads/posts");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed"));
  },
});

// Helper function to format post for response
const formatPostResponse = (post, req) => {
  const userId = req.user ? req.user.id : null;

  return {
    id: post._id,
    title: post.title,
    content: post.content,
    media: post.media,
    user: {
      id: post.user._id,
      username: post.user.username,
      avatar: post.user.avatar,
      verified: post.user.verified,
    },
    subreddit: {
      id: post.subreddit._id,
      name: post.subreddit.name,
      displayName: post.subreddit.displayName,
    },
    createdAt: post.createdAt,
    timeAgo: post.timeAgo,
    voteScore: post.voteScore,
    commentCount: post.commentCount,
    views: post.views,
    tags: post.tags,
    isPinned: post.isPinned,
    isLocked: post.isLocked,
    isSponsored: post.isSponsored,
    userVote: userId
      ? post.upvotes.includes(userId)
        ? "upvote"
        : post.downvotes.includes(userId)
        ? "downvote"
        : null
      : null,
    isSaved: userId ? post.savedBy.includes(userId) : false,
  };
};

// GET /api/posts - Get posts for feed
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "new",
      subreddit,
      tag,
      search,
    } = req.body || {};
    console.log("Fetching posts with params:", {
      page,
      limit,
      sort,
      subreddit,
      tag,
      search,
    });
    const skip = (page - 1) * limit;
    const query = {
      isActive: true,
      isRemoved: false,
    };

    // Add subreddit filter
    if (subreddit) {
      const subredditDoc = await Subreddit.findOne({ name: subreddit });
      if (!subredditDoc) {
        return res.status(404).json({ message: "Subreddit not found" });
      }
      query.subreddit = subredditDoc._id;
    }

    // Add tag filter
    if (tag) {
      query.tags = tag.toLowerCase();
    }

    let posts;
    if (search) {
      query.$text = { $search: search };

      posts = await Post.find(query, {
        score: { $meta: "textScore" },
      })
        .sort({ score: { $meta: "textScore" } })
        .skip(skip)
        .limit(Number(limit) * 2) // Fetch extra to account for post-filtering
        .populate("user", "username avatar verified")
        .populate("subreddit", "name displayName");

      // Slice after filtering
      posts = posts.slice(0, Number(limit));
    } else {
      // No search – apply sort logic
      let sortOption = {};
      switch (sort) {
        case "hot":
          sortOption = { voteScore: -1, createdAt: -1 };
          break;
        case "top":
          sortOption = { voteScore: -1 };
          break;
        case "new":
        default:
          sortOption = { createdAt: -1 };
          break;
      }

      posts = await Post.find(query)
        .populate("user", "username avatar verified")
        .populate("subreddit", "name displayName")
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit));
    }

    const formattedPosts = posts.map((post) => formatPostResponse(post, req));

    res.json({
      posts: formattedPosts,
      page: Number(page),
      limit: Number(limit),
      hasMore: posts.length === Number(limit),
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/posts/trending - Get trending posts
router.get("/trending", async (req, res) => {
  try {
    const { timeframe = "24h", limit = 5 } = req.query;
    const posts = await Post.findTrending(timeframe, Number.parseInt(limit));

    const formattedPosts = posts.map((post) => formatPostResponse(post, req));

    res.json(formattedPosts);
  } catch (error) {
    console.error("Error fetching trending posts:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/posts/:id - Get single post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("user", "username avatar verified")
      .populate("subreddit", "name displayName");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Increment view count
    post.views += 1;
    await post.save();

    res.json(formatPostResponse(post, req));
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/posts - Create new post
router.post("/", protect, upload.array("media", 5), async (req, res) => {
  try {
    const { title, content, subredditId, tags } = req.body;

    // Validate required fields
    if (!title || !content || !subredditId) {
      // Delete uploaded files if validation fails
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          fs.unlinkSync(file.path);
        });
      }
      return res
        .status(400)
        .json({ message: "Title, content and subreddit are required" });
    }

    // Check if subreddit exists
    const subreddit = await Subreddit.findById(subredditId);
    if (!subreddit) {
      // Delete uploaded files if subreddit not found
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          fs.unlinkSync(file.path);
        });
      }
      return res.status(404).json({ message: "Subreddit not found" });
    }

    // Process media files
    const media = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        media.push({
          type: "image",
          url: `/uploads/posts/${file.filename}`,
          caption: "",
        });
      });
    }

    // Process tags
    let processedTags = [];
    if (tags) {
      try {
        if (typeof tags === "string") {
          processedTags = JSON.parse(tags);
        } else {
          processedTags = tags;
        }
        // Ensure tags are strings and lowercase
        processedTags = processedTags.map((tag) =>
          tag.toString().toLowerCase()
        );
      } catch (e) {
        console.error("Error processing tags:", e);
      }
    }

    // Create new post
    const newPost = new Post({
      title,
      content,
      user: req.user.id,
      subreddit: subredditId,
      media,
      tags: processedTags,
    });

    await newPost.save();

    // Increment post count in subreddit
    subreddit.postCount += 1;
    await subreddit.save();

    // Populate user and subreddit info
    await newPost.populate("user", "username avatar verified");
    await newPost.populate("subreddit", "name displayName");

    res.status(201).json(formatPostResponse(newPost, req));
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/posts/:id - Update post
router.put("/:id", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user is the post owner
    if (post.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this post" });
    }

    // Check if post is locked
    if (post.isLocked) {
      return res
        .status(403)
        .json({ message: "This post is locked and cannot be edited" });
    }

    const { title, content, tags } = req.body;

    // Update fields
    if (title) post.title = title;
    if (content) post.content = content;
    if (tags) {
      let processedTags = [];
      try {
        if (typeof tags === "string") {
          processedTags = JSON.parse(tags);
        } else {
          processedTags = tags;
        }
        post.tags = processedTags.map((tag) => tag.toString().toLowerCase());
      } catch (e) {
        console.error("Error processing tags:", e);
      }
    }

    await post.save();

    // Populate user and subreddit info
    await post.populate("user", "username avatar verified");
    await post.populate("subreddit", "name displayName");

    res.json(formatPostResponse(post, req));
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/posts/:id - Delete post
router.delete("/:id", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user is the post owner
    if (post.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    // Delete media files
    if (post.media && post.media.length > 0) {
      post.media.forEach((media) => {
        const filePath = path.join(__dirname, "..", media.url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    // Decrement post count in subreddit
    const subreddit = await Subreddit.findById(post.subreddit);
    if (subreddit) {
      subreddit.postCount = Math.max(0, subreddit.postCount - 1);
      await subreddit.save();
    }

    await post.remove();

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/posts/:id/vote - Vote on post
router.post("/:id/vote", protect, async (req, res) => {
  try {
    const { voteType } = req.body;

    if (!["upvote", "downvote", "remove"].includes(voteType)) {
      return res.status(400).json({ message: "Invalid vote type" });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (voteType === "upvote") {
      await post.upvote(req.user.id);
    } else if (voteType === "downvote") {
      await post.downvote(req.user.id);
    } else if (voteType === "remove") {
      // Remove any votes
      post.upvotes = post.upvotes.filter((id) => !id.equals(req.user.id));
      post.downvotes = post.downvotes.filter((id) => !id.equals(req.user.id));
      post.voteScore = post.upvotes.length - post.downvotes.length;
      await post.save();
    }

    res.json({
      voteScore: post.voteScore,
      userVote: post.upvotes.includes(req.user.id)
        ? "upvote"
        : post.downvotes.includes(req.user.id)
        ? "downvote"
        : null,
    });
  } catch (error) {
    console.error("Error voting on post:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/posts/:id/save - Save/unsave post
router.post("/:id/save", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await post.toggleSave(req.user.id);

    res.json({
      saved: post.savedBy.includes(req.user.id),
    });
  } catch (error) {
    console.error("Error saving post:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/posts/:id/report - Report post
router.post("/:id/report", protect, async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: "Report reason is required" });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user already reported this post
    const existingReport = post.reports.find(
      (report) => report.user.toString() === req.user.id
    );

    if (existingReport) {
      return res
        .status(400)
        .json({ message: "You have already reported this post" });
    }

    post.reports.push({
      user: req.user.id,
      reason,
    });

    await post.save();

    res.json({ message: "Post reported successfully" });
  } catch (error) {
    console.error("Error reporting post:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/posts/user/:userId - Get posts by user
router.get("/user/:userId", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const posts = await Post.find({
      user: req.params.userId,
      isActive: true,
      isRemoved: false,
    })
      .populate("user", "username avatar verified")
      .populate("subreddit", "name displayName")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const formattedPosts = posts.map((post) => formatPostResponse(post, req));

    res.json({
      posts: formattedPosts,
      page: Number.parseInt(page),
      limit: Number.parseInt(limit),
      hasMore: posts.length === Number.parseInt(limit),
    });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/posts/saved - Get saved posts
router.get("/saved", protect, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const posts = await Post.find({
      savedBy: req.user.id,
      isActive: true,
      isRemoved: false,
    })
      .populate("user", "username avatar verified")
      .populate("subreddit", "name displayName")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const formattedPosts = posts.map((post) => formatPostResponse(post, req));

    res.json({
      posts: formattedPosts,
      page: Number.parseInt(page),
      limit: Number.parseInt(limit),
      hasMore: posts.length === Number.parseInt(limit),
    });
  } catch (error) {
    console.error("Error fetching saved posts:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add this to your API/routes/postRoutes.js
router.get('/search', async (req, res) => {
  try {
    const { q, type = 'all', sort = 'relevance' } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.json({ posts: [], subreddits: [], users: [] });
    }

    const searchTerm = q.trim();
    const searchRegex = new RegExp(searchTerm, 'i'); // Case insensitive

    let results = { posts: [], subreddits: [], users: [] };

    // Search Posts
    if (type === 'all' || type === 'posts') {
      const postQuery = {
        $or: [
          { title: searchRegex },
          { content: searchRegex }
        ]
      };

      let postsQuery = Post.find(postQuery)
        .populate('author', 'username')
        .populate('subreddit', 'name')
        .limit(20);

      // Apply sorting
      switch (sort) {
        case 'new':
          postsQuery = postsQuery.sort({ createdAt: -1 });
          break;
        case 'top':
          postsQuery = postsQuery.sort({ upvotes: -1 });
          break;
        case 'relevance':
        default:
          // Simple relevance: title matches first, then content matches
          postsQuery = postsQuery.sort({ createdAt: -1 });
          break;
      }

      results.posts = await postsQuery;
    }

    // Search Subreddits
    if (type === 'all' || type === 'communities') {
      results.subreddits = await Subreddit.find({
        $or: [
          { name: searchRegex },
          { description: searchRegex }
        ]
      }).limit(10);
    }

    // Search Users
    if (type === 'all' || type === 'users') {
      results.users = await User.find({
        username: searchRegex
      }).select('username').limit(10);
    }

    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Search failed' });
  }
});

module.exports = router;
