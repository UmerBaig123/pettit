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
  const searchQuery = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState({ posts: [], subreddits: [], users: [] });
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
    }
  }, [searchQuery]);

  const handleSearch = async (query) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(`/api/posts/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const results = await response.json();
        setSearchResults(results);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  if (searchQuery.trim()) {
    return (
      <div className="min-h-screen bg-gray-100">
        <SearchResults 
          searchQuery={searchQuery}
          searchResults={searchResults}
          isLoading={isSearching}
        />
      </div>
    );
  }
  useEffect(() => {
    // Fetch posts from the API
    fetch(`http://localhost:5000/api/posts?limit=10&page=${currentPage}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched posts:", data);
        setPosts(data.posts);
        setTotalPages(data.totalPages);
      })
      .catch((error) => console.error("Error fetching posts:", error));
  }, [currentPage]);
  // Sample posts data with real pet images

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
