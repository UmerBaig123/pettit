import { useEffect, useState } from "react";
import Navbar from "../components/navbar/Navbar";
import SecondaryNav from "../components/navbar/SecondaryNav";
import FeedHeader from "../components/feedHeader/FeedHeader";
import PostCard from "../components/Cards/PostCard";
import Suggested from "../components/Cards/Suggested";
import { useSearchParams } from 'react-router-dom';
import SearchResults from '../components/SearchResults';

export default function ForYou() {
  const [activeTab, setActiveTab] = useState("for-you");
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState({ posts: [], subreddits: [], users: [] });
  const [isSearching, setIsSearching] = useState(false);

  const searchQuery = searchParams.get('q') || '';

useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch(searchQuery)
    }
  }, [searchQuery])

  useEffect(() => {
    if (!searchQuery.trim()) {
      fetch(`http://localhost:5000/api/posts?limit=10&page=${currentPage}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched posts:", data)
          setPosts(data.posts || [])
          setTotalPages(data.totalPages || 1)
        })
        .catch((error) => console.error("Error fetching posts:", error))
    }
  }, [currentPage, searchQuery])

  // FUNCTIONS
  const handleSearch = async (query) => {
    if (!query.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch(`http://localhost:5000/api/posts/search?q=${encodeURIComponent(query)}`)
      if (response.ok) {
        const results = await response.json()
        setSearchResults(results)
      }
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsSearching(false)
    }
  }

  if (searchQuery.trim()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-25 to-violet-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Search Results for "{searchQuery}"</h2>

            {isSearching ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                <span className="ml-2">Searching...</span>
              </div>
            ) : (
              <div>
                {searchResults.posts && searchResults.posts.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Posts ({searchResults.posts.length})</h3>
                    {searchResults.posts.map((post) => (
                      <PostCard key={post._id} post={post} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No posts found for "{searchQuery}"</p>
                )}

                {searchResults.subreddits && searchResults.subreddits.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-2">Communities ({searchResults.subreddits.length})</h3>
                    <div className="space-y-2">
                      {searchResults.subreddits.map((subreddit) => (
                        <div key={subreddit._id} className="p-3 bg-gray-50 rounded">
                          <p className="font-medium">r/{subreddit.name}</p>
                          <p className="text-sm text-gray-600">{subreddit.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

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
            <Suggested />
          </div>
        </div>
      </div>
    </div>
  );
}
