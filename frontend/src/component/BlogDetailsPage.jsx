import React, { useState } from "react";
import { useTheme } from "../ThemeContext";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";
import { PostComment } from "./PostComment";
import axios from "axios";

export const BlogDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { blog } = location.state || {};
  const { isDarkMode } = useTheme();

  const [likes, setLikes] = useState(blog?.likes || 0);

  const BASE_URL = import.meta.env.VITE_API_URL;

  const handleBack = () => {
    navigate(-1);
  };

  const handleLike = () => {
    axios
      .post(`${BASE_URL}/api/Blogs/posts/${blog._id}/like`)
      .then(() => setLikes((prev) => prev + 1))
      .catch((error) => console.error("Error liking blog:", error));
  };

  if (!blog) {
    return (
      <div
        className={`container mx-auto p-6 ${
          isDarkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-900"
        }`}
      >
        Blog not found!
      </div>
    );
  }

  return (
    <div
      className={`p-8 py-20 min-h-screen ${
        isDarkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Navbar />
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-10">
        <button
          onClick={handleBack}
          className={`mb-8 px-6 py-2 rounded-full text-white font-semibold ${
            isDarkMode
              ? "bg-blue-600 hover:bg-blue-800"
              : "bg-blue-500 hover:bg-blue-700"
          } transition focus:outline-none`}
        >
          ⬅ Back
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            {blog.image && (
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-auto rounded-xl object-cover shadow-md"
              />
            )}
            {blog.video && (
              <video
                src={blog.video}
                alt={blog.title}
                controls
                muted
                className="w-full h-auto rounded-xl object-cover shadow-md"
              />
            )}
          </div>

          <div className="flex flex-col justify-start">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
              {blog.title}
            </h1>

            <div className="prose max-w-full leading-relaxed text-gray-700 mb-6">
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              {blog.categories.map((category) => (
                <span
                  key={category._id}
                  className="bg-blue-100 text-blue-700 rounded-full px-4 py-1 cursor-pointer hover:bg-blue-200 transition"
                >
                  #{category.name}
                </span>
              ))}
            </div>

            <div className="flex items-center space-x-6">
              <button
                onClick={handleLike}
                className="bg-red-100 hover:bg-red-200 p-3 rounded-full transition"
                aria-label="Like blog post"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 18l-1.44-1.21C4.2 13.28 0 9.67 0 6.5 0 3.42 2.69 1 5.5 1c1.74 0 3.41.81 4.5 2.09C11.09 1.81 12.76 1 14.5 1 17.31 1 20 3.42 20 6.5c0 3.17-4.2 6.78-8.56 10.29L10 18z" />
                </svg>
              </button>
              <span className="text-3xl font-bold text-gray-900">{likes}</span>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-16">
          <PostComment blog={blog} />
        </div>
      </div>
    </div>
  );
};
