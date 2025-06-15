import {
  Home,
  Users,
  ShoppingBag,
  TrendingUp,
  Bookmark,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
const SecondaryNav = () => {
  const navigate = useNavigate();
  return (
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
          <button
            className="w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-semibold rounded-lg py-2 px-4 transition-all duration-200 flex items-center justify-center gap-2"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/create-post")}
          >
            <Plus className="w-4 h-4" />
            Create Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecondaryNav;
