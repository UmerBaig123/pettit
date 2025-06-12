import { Filter } from "lucide-react";
const FeedHeader = ({ activeTab, setActiveTab }) => {
  return (
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
            activeTab === "for-you"
              ? "bg-orange-100 text-orange-600"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          For You
        </button>
        <button
          onClick={() => setActiveTab("following")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "following"
              ? "bg-orange-100 text-orange-600"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Following
        </button>
        <button
          onClick={() => setActiveTab("communities")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "communities"
              ? "bg-orange-100 text-orange-600"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Communities
        </button>
      </div>
    </div>
  );
};
export default FeedHeader;
