import { useEffect, useState } from "react";

const Suggested = ({}) => {
  const [suggestedCommunities, setSuggestedCommunities] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/api/subreddits?limit=5")
      .then((response) => response.json())
      .then((data) => setSuggestedCommunities(data.subreddits))
      .catch((error) =>
        console.error("Error fetching suggested communities:", error)
      );
  }, []);
  return (
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
  );
};

export default Suggested;
