"use client"

import { useState } from "react"
import {Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, PawPrint, Search, Bell, User, Home, Users, ShoppingBag, TrendingUp, Plus,
  Filter,
  Star,
  Clock,
} from "lucide-react"

export default function ForYou() {
  const [activeTab, setActiveTab] = useState("for-you")

  // Sample posts data with real pet images
  const posts = [
    {
      id: 1,
      user: {
        name: "Sarah Johnson",
        username: "@sarahpets",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
        verified: true,
      },
      content:
        "Just adopted this little angel from the shelter! Meet Luna 🌙 She's already stolen my heart ❤️ #AdoptDontShop #NewFamilyMember",
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=400&fit=crop",
      timestamp: "2h ago",
      likes: 234,
      comments: 45,
      shares: 12,
      community: "r/AdoptDontShop",
      tags: ["adoption", "rescue", "cat"],
    },
    {
      id: 2,
      user: {
        name: "Mike Chen",
        username: "@dogdadmike",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
        verified: false,
      },
      content:
        "Training session with Max today! He finally mastered the 'stay' command. So proud of this good boy! 🐕 Any tips for teaching 'roll over' next?",
      image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=400&fit=crop",
      timestamp: "4h ago",
      likes: 189,
      comments: 23,
      shares: 8,
      community: "r/DogTraining",
      tags: ["training", "goodboy", "progress"],
    },
    {
      id: 3,
      user: {
        name: "Pet Paradise Store",
        username: "@petparadise",
        avatar: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop&crop=face",
        verified: true,
      },
      content:
        "🎉 FLASH SALE: 30% off all premium pet toys! Your furry friends deserve the best. Limited time offer! Free shipping on orders over $50 🚚",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop",
      timestamp: "6h ago",
      likes: 156,
      comments: 34,
      shares: 67,
      community: "r/PetDeals",
      tags: ["sale", "toys", "deals"],
      isSponsored: true,
    },
    {
      id: 4,
      user: {
        name: "Dr. Emily Rodriguez",
        username: "@vetemilyrod",
        avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face",
        verified: true,
      },
      content:
        "Important reminder: Regular dental care is crucial for your pet's overall health! Here are 5 signs that indicate your pet may need dental attention. Early detection can prevent serious complications. 🦷",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=400&fit=crop",
      timestamp: "8h ago",
      likes: 312,
      comments: 67,
      shares: 89,
      community: "r/VeterinaryAdvice",
      tags: ["dental-health", "prevention", "vet-tips"],
    },
    {
      id: 5,
      user: {
        name: "Bunny Lover Emma",
        username: "@emmabunnylove",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
        verified: false,
      },
      content:
        "My little Snowball discovered the joy of cardboard boxes today! 📦 Who knew the simplest things could bring so much happiness? #BunnyLife #SimpleJoys",
      image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&h=400&fit=crop",
      timestamp: "12h ago",
      likes: 98,
      comments: 15,
      shares: 4,
      community: "r/Rabbits",
      tags: ["bunny", "cute", "playtime"],
    },
  ]

  const trendingTopics = [
    { name: "Pet Adoption Week", posts: "12.5K posts" },
    { name: "Golden Retriever", posts: "8.2K posts" },
    { name: "Cat Cafe", posts: "5.7K posts" },
    { name: "Pet Training Tips", posts: "4.1K posts" },
    { name: "Rescue Stories", posts: "3.8K posts" },
  ]

  const suggestedCommunities = [
    {
      name: "r/CatsOfReddit",
      members: "2.1M",
      image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=40&h=40&fit=crop",
    },
    {
      name: "r/rarepuppers",
      members: "1.8M",
      image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=40&h=40&fit=crop",
    },
    {
      name: "r/PetAdvice",
      members: "890K",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=40&h=40&fit=crop",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-25 to-violet-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-rose-500 rounded-lg flex items-center justify-center">
                <PawPrint className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
                  Pettit
                </h1>
                <p className="text-xs text-gray-600 -mt-1">Pet Community Platform</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search communities, posts, or users..."
                  className="w-full pl-10 pr-4 h-10 border border-gray-200 rounded-full focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all duration-200 outline-none text-sm bg-gray-50"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <User className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-lg sticky top-24">
              <nav className="space-y-2">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-orange-50 rounded-lg transition-colors text-orange-600 bg-orange-50">
                  <Home className="w-5 h-5" />
                  <span className="font-medium">For You</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors text-gray-700">
                  <TrendingUp className="w-5 h-5" />
                  <span>Trending</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors text-gray-700">
                  <Users className="w-5 h-5" />
                  <span>Communities</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors text-gray-700">
                  <ShoppingBag className="w-5 h-5" />
                  <span>Marketplace</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors text-gray-700">
                  <Bookmark className="w-5 h-5" />
                  <span>Saved</span>
                </button>
              </nav>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <button className="w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-semibold rounded-lg py-2 px-4 transition-all duration-200 flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Post
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Feed Header */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-lg mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">For You</h2>
                <button className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("for-you")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "for-you" ? "bg-orange-100 text-orange-600" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  For You
                </button>
                <button
                  onClick={() => setActiveTab("following")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "following" ? "bg-orange-100 text-orange-600" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Following
                </button>
                <button
                  onClick={() => setActiveTab("communities")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "communities" ? "bg-orange-100 text-orange-600" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Communities
                </button>
              </div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg overflow-hidden"
                >
                  {/* Post Header */}
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.user.avatar || "/placeholder.svg"}
                          alt={post.user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-800">{post.user.name}</h3>
                            {post.user.verified && <Star className="w-4 h-4 text-orange-500 fill-current" />}
                            {post.isSponsored && (
                              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                Sponsored
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{post.user.username}</span>
                            <span>•</span>
                            <span>{post.community}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{post.timestamp}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                        <MoreHorizontal className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>

                    {/* Post Content */}
                    <div className="mt-3">
                      <p className="text-gray-800 leading-relaxed">{post.content}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full hover:bg-orange-200 cursor-pointer transition-colors"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Post Image */}
                  {post.image && (
                    <div className="px-4">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt="Post content"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* Post Actions */}
                  <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
                          <Heart className="w-5 h-5" />
                          <span className="text-sm">{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
                          <MessageCircle className="w-5 h-5" />
                          <span className="text-sm">{post.comments}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition-colors">
                          <Share2 className="w-5 h-5" />
                          <span className="text-sm">{post.shares}</span>
                        </button>
                      </div>
                      <button className="text-gray-600 hover:text-orange-500 transition-colors">
                        <Bookmark className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Trending Topics */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-lg">
              <h3 className="font-bold text-gray-800 mb-4">Trending in Pets</h3>
              <div className="space-y-3">
                {trendingTopics.map((topic, index) => (
                  <div key={index} className="hover:bg-gray-50 p-2 rounded-lg cursor-pointer transition-colors">
                    <h4 className="font-medium text-gray-800 text-sm">#{topic.name}</h4>
                    <p className="text-xs text-gray-500">{topic.posts}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Communities */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-lg">
              <h3 className="font-bold text-gray-800 mb-4">Suggested Communities</h3>
              <div className="space-y-3">
                {suggestedCommunities.map((community, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={community.image || "/placeholder.svg"}
                        alt={community.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-medium text-gray-800 text-sm">{community.name}</h4>
                        <p className="text-xs text-gray-500">{community.members} members</p>
                      </div>
                    </div>
                    <button className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full hover:bg-orange-200 transition-colors">
                      Join
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-lg">
              <h3 className="font-bold text-gray-800 mb-4">Your Activity</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Posts this week</span>
                  <span className="font-semibold text-orange-600">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Communities joined</span>
                  <span className="font-semibold text-orange-600">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Karma points</span>
                  <span className="font-semibold text-orange-600">1,247</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
