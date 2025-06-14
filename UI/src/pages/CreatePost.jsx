"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PawPrint,
  Search,
  Bell,
  User,
  ImageIcon,
  Hash,
  X,
  Upload,
  ArrowLeft,
} from "lucide-react";
import Navbar from "../components/navbar/Navbar";

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    subreddit: "",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [subreddits, setSubreddits] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch available subreddits
  useEffect(() => {
    const fetchSubreddits = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/subreddits");
        const data = await response.json();
        setSubreddits(data.subreddits || data);
      } catch (error) {
        console.error("Error fetching subreddits:", error);
        // Fallback to empty array if API fails
        setSubreddits([]);
      }
    };

    fetchSubreddits();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const addTag = () => {
    if (
      tagInput.trim() &&
      !formData.tags.includes(tagInput.trim().toLowerCase())
    ) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim().toLowerCase()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleTagKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("subredditId", formData.subreddit);
      formDataToSend.append("tags", JSON.stringify(formData.tags));

      // Add file if selected
      if (selectedFile) {
        formDataToSend.append("media", selectedFile);
      }

      // Get auth token from localStorage
      const token = localStorage.getItem("token");

      console.log("Sending request to create post:", {
        title: formData.title,
        subredditId: formData.subreddit,
        contentLength: formData.content.length,
        tags: formData.tags,
        hasFile: !!selectedFile,
      });

      // First, test if the server is responding at all
      const healthCheck = await fetch("/health");
      console.log("Health check status:", healthCheck.status);

      // Now try to create the post
      const response = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formDataToSend,
      });

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries([...response.headers.entries()])
      );

      // Check if response is empty
      const responseText = await response.text();
      console.log("Raw response:", responseText);

      if (!responseText) {
        throw new Error("Server returned an empty response");
      }

      // Try to parse the response as JSON
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError);
        throw new Error("Server returned an invalid JSON response");
      }

      if (!response.ok) {
        throw new Error(result.message || "Failed to create post");
      }

      console.log("Post created successfully:", result);

      // Show success message
      alert("Post created successfully!");

      // Navigate back to feed
      navigate("/fyp");
    } catch (error) {
      console.error("Error creating post:", error);
      alert(`Error creating post: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/fyp")}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Feed
        </button>

        {/* Create Post Form */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Create a New Post
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subreddit Selection */}
            <div>
              <label
                htmlFor="subreddit"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Choose a Community *
              </label>
              <select
                id="subreddit"
                name="subreddit"
                value={formData.subreddit}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400/20 focus:border-orange-400 transition-all duration-200 outline-none"
                required
              >
                <option value="">Select a subreddit...</option>
                {subreddits.map((subreddit) => (
                  <option key={subreddit._id} value={subreddit._id}>
                    r/{subreddit.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="An interesting title for your post..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400/20 focus:border-orange-400 transition-all duration-200 outline-none"
                required
              />
            </div>

            {/* Content */}
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Content *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Share your thoughts, experiences, or ask questions..."
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400/20 focus:border-orange-400 transition-all duration-200 outline-none resize-vertical"
                required
              />
            </div>

            {/* Tags */}
            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tags (Optional)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                  placeholder="Add a tag..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400/20 focus:border-orange-400 transition-all duration-200 outline-none"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors"
                >
                  <Hash className="w-4 h-4" />
                </button>
              </div>

              {/* Tag Display */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-orange-500 hover:text-orange-700 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Image (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">
                    Click to upload an image or drag and drop
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    JPG, PNG, GIF up to 5MB
                  </p>
                </label>
              </div>
              {selectedFile && (
                <div className="mt-2 flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-700 truncate">
                      {selectedFile.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate("/fyp")}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-semibold rounded-lg py-2 px-6 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Post..." : "Create Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
