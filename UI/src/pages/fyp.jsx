import { useState } from "react";
import Navbar from "../components/navbar/Navbar";
import SecondaryNav from "../components/navbar/SecondaryNav";
import FeedHeader from "../components/feedHeader/FeedHeader";
import PostCard from "../components/Cards/PostCard";

export default function ForYou() {
  const [activeTab, setActiveTab] = useState("for-you");

  // Sample posts data with real pet images
  const posts = [
    {
      id: 1,
      user: {
        name: "Sarah Johnson",
        username: "@sarahpets",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
        verified: true,
      },
      content:
        "Just adopted this little angel from the shelter! Meet Luna 🌙 She's already stolen my heart ❤️ #AdoptDontShop #NewFamilyMember",
      image:
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=400&fit=crop",
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
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
        verified: false,
      },
      content:
        "Training session with Max today! He finally mastered the 'stay' command. So proud of this good boy! 🐕 Any tips for teaching 'roll over' next?",
      image:
        "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=400&fit=crop",
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
        avatar:
          "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop&crop=face",
        verified: true,
      },
      content:
        "🎉 FLASH SALE: 30% off all premium pet toys! Your furry friends deserve the best. Limited time offer! Free shipping on orders over $50 🚚",
      image:
        "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop",
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
        avatar:
          "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face",
        verified: true,
      },
      content:
        "Important reminder: Regular dental care is crucial for your pet's overall health! Here are 5 signs that indicate your pet may need dental attention. Early detection can prevent serious complications. 🦷",
      image:
        "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=400&fit=crop",
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
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
        verified: false,
      },
      content:
        "My little Snowball discovered the joy of cardboard boxes today! 📦 Who knew the simplest things could bring so much happiness? #BunnyLife #SimpleJoys",
      image:
        "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&h=400&fit=crop",
      timestamp: "12h ago",
      likes: 98,
      comments: 15,
      shares: 4,
      community: "r/Rabbits",
      tags: ["bunny", "cute", "playtime"],
    },
  ];

  const trendingTopics = [
    { name: "Pet Adoption Week", posts: "12.5K posts" },
    { name: "Golden Retriever", posts: "8.2K posts" },
    { name: "Cat Cafe", posts: "5.7K posts" },
    { name: "Pet Training Tips", posts: "4.1K posts" },
    { name: "Rescue Stories", posts: "3.8K posts" },
  ];

  const suggestedCommunities = [
    {
      name: "r/CatsOfReddit",
      members: "2.1M",
      image:
        "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=40&h=40&fit=crop",
    },
    {
      name: "r/rarepuppers",
      members: "1.8M",
      image:
        "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=40&h=40&fit=crop",
    },
    {
      name: "r/PetAdvice",
      members: "890K",
      image:
        "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=40&h=40&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-25 to-violet-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Navigation */}
          <SecondaryNav />

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Feed Header */}
            <FeedHeader activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Posts Feed */}
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard post={post} key={post.id} />
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
                  <div
                    key={index}
                    className="hover:bg-gray-50 p-2 rounded-lg cursor-pointer transition-colors"
                  >
                    <h4 className="font-medium text-gray-800 text-sm">
                      #{topic.name}
                    </h4>
                    <p className="text-xs text-gray-500">{topic.posts}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Communities */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-lg">
              <h3 className="font-bold text-gray-800 mb-4">
                Suggested Communities
              </h3>
              <div className="space-y-3">
                {suggestedCommunities.map((community, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={community.image || "/placeholder.svg"}
                        alt={community.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-medium text-gray-800 text-sm">
                          {community.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {community.members} members
                        </p>
                      </div>
                    </div>
                    <button className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full hover:bg-orange-200 transition-colors">
                      Join
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
