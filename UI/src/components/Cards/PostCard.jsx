import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Star,
  Clock,
} from "lucide-react";
const PostCard = ({ post }) => {
  return (
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
                <h3 className="font-semibold text-gray-800">
                  {post.user.name}
                </h3>
                {post.user.verified && (
                  <Star className="w-4 h-4 text-orange-500 fill-current" />
                )}
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
      {post.media && (
        <div className="px-4">
          <img
            src={
              "http://localhost:5000/" + post?.media?.url || "/placeholder.svg"
            }
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
  );
};
export default PostCard;
