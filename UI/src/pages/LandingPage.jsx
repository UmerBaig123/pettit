import { Link } from 'react-router-dom';
import { PawPrintIcon as Paw, Users, MessageSquare, Heart, Eye, ArrowUp} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function LandingPage() {
    const [featuredPosts, setFeaturedPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
  const fetchFeaturedPosts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/posts');
      if (response.ok) {
        const data = await response.json();
        console.log('Raw response:', data);
        
        // Extract the posts array from the response object
        const postsArray = data.posts || [];
        console.log('Posts array:', postsArray);
        console.log('Is array?', Array.isArray(postsArray));
        
        setFeaturedPosts(postsArray);
      } else {
        console.error('Failed to fetch posts:', response.status);
        setFeaturedPosts([]);
      }
    } catch (error) {
      console.error('Error fetching featured posts:', error);
      setFeaturedPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  fetchFeaturedPosts();
}, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-orange-500 p-4 rounded-full">
              <Paw className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-orange-500">Pettit</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The ultimate community for pet lovers! Share stories, get advice, 
            buy and sell pet products, and connect with fellow pet enthusiasts.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-orange-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors"
            >
              Join Pettit
            </Link>
            <Link 
              to="/login" 
              className="border-2 border-orange-500 text-orange-500 px-8 py-3 rounded-full font-semibold hover:bg-orange-50 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6">
            <div className="bg-orange-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Users className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Join Communities</h3>
            <p className="text-gray-600">
              Connect with pet communities for dogs, cats, birds, and more exotic pets.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="bg-orange-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Share & Discuss</h3>
            <p className="text-gray-600">
              Share photos, stories, and get expert advice from fellow pet owners.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="bg-orange-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Heart className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Marketplace</h3>
            <p className="text-gray-600">
              Buy and sell pet products, find services, and discover local pet businesses.
            </p>
          </div>
        </div>
        {/* Featured Posts */}
<div className="container mx-auto px-4 py-16">
  <h2 className="text-3xl font-bold text-center mb-12">What's Happening on Pettit</h2>
  
  {isLoading ? (
    <div className="flex justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
    </div>
  ) : (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredPosts.map((post) => (
        <div key={post._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
          {/* Post Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <span className="font-medium text-orange-500">r/{post.subreddit?.name || 'pets'}</span>
              <span className="mx-2">•</span>
              <span>by u/{post.author?.username || 'anonymous'}</span>
            </div>
            <h3 className="font-semibold text-gray-900 line-clamp-2">{post.title}</h3>
          </div>

          {/* Post Content */}
          <div className="p-4">
            {post.type === 'image' && post.content && (
              <img 
                src={post.content || "/placeholder.svg"} 
                alt={post.title}
                className="w-full h-48 object-cover rounded mb-3"
              />
            )}
            
            {post.type === 'text' && post.content && (
              <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                {post.content}
              </p>
            )}

            {/* Post Stats */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span>{post.upvotes || 0}</span>
                </div>
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span>{post.commentCount || 0}</span>
                </div>
              </div>
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                <span>Preview</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}

  {/* Call to Action */}
  <div className="text-center mt-12">
    <p className="text-gray-600 mb-4">Join thousands of pet lovers sharing their stories!</p>
    <Link 
      to="/register" 
      className="bg-orange-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-orange-600 transition-colors"
    >
      Start Sharing Today
    </Link>
  </div>
</div>
      </div>
        <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Popular Communities</h2>
            <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <Paw className="h-8 w-8 text-orange-500 mx-auto mb-3" />
                <h4 className="font-semibold">r/DogLovers</h4>
                <p className="text-sm text-gray-600">45.2k members</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <Paw className="h-8 w-8 text-orange-500 mx-auto mb-3" />
                <h4 className="font-semibold">r/CatAppreciation</h4>
                <p className="text-sm text-gray-600">38.7k members</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <Paw className="h-8 w-8 text-orange-500 mx-auto mb-3" />
                <h4 className="font-semibold">r/ExoticPets</h4>
                <p className="text-sm text-gray-600">12.3k members</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <Paw className="h-8 w-8 text-orange-500 mx-auto mb-3" />
                <h4 className="font-semibold">r/PetAdvice</h4>
                <p className="text-sm text-gray-600">29.1k members</p>
            </div>
            </div>
        </div>
        </div>
    </div>
  );
}

