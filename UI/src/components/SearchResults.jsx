// Create UI/src/components/SearchResults.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, MessageSquare, TrendingUp, Clock, Search } from 'lucide-react';
import PostCard from './Cards/PostCard';

export default function SearchResults({ searchQuery, searchResults, isLoading }) {
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');

  const { posts = [], subreddits = [], users = [] } = searchResults;
  const totalResults = posts.length + subreddits.length + users.length;

  const tabs = [
    { id: 'all', label: 'All', count: totalResults },
    { id: 'posts', label: 'Posts', count: posts.length },
    { id: 'communities', label: 'Communities', count: subreddits.length },
    { id: 'users', label: 'Users', count: users.length }
  ];

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!searchQuery) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Search Pettit</h3>
        <p className="text-gray-500">Find posts, communities, and users</p>
      </div>
    );
  }

  if (totalResults === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
        <p className="text-gray-500">
          No results for "<span className="font-medium">{searchQuery}</span>"
        </p>
        <div className="mt-4 text-sm text-gray-500">
          <p>Try:</p>
          <ul className="mt-2 space-y-1">
            <li>• Checking your spelling</li>
            <li>• Using different keywords</li>
            <li>• Searching for more general terms</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Search Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Search results for "<span className="text-orange-500">{searchQuery}</span>"
        </h2>
        <p className="text-gray-600">
          {totalResults} result{totalResults !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Sort Options (for posts) */}
      {(activeTab === 'all' || activeTab === 'posts') && posts.length > 0 && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="relevance">Relevance</option>
            <option value="new">New</option>
            <option value="top">Top</option>
          </select>
        </div>
      )}

      {/* Results */}
      <div className="space-y-6">
        {/* Communities Section */}
        {(activeTab === 'all' || activeTab === 'communities') && subreddits.length > 0 && (
          <div>
            {activeTab === 'all' && (
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Communities
              </h3>
            )}
            <div className="grid gap-3">
              {subreddits.map(subreddit => (
                <Link
                  key={subreddit._id}
                  to={`/r/${subreddit.name}`}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {subreddit.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">r/{subreddit.name}</h4>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {subreddit.description || 'A community for pet lovers'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {subreddit.memberCount || 0} members
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Users Section */}
        {(activeTab === 'all' || activeTab === 'users') && users.length > 0 && (
          <div>
            {activeTab === 'all' && (
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Users
              </h3>
            )}
            <div className="grid gap-3">
              {users.map(user => (
                <Link
                  key={user._id}
                  to={`/user/${user.username}`}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-700 font-bold text-sm">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">u/{user.username}</h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Posts Section */}
        {(activeTab === 'all' || activeTab === 'posts') && posts.length > 0 && (
          <div>
            {activeTab === 'all' && (
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Posts
              </h3>
            )}
            <div className="space-y-4">
              {posts.map(post => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}