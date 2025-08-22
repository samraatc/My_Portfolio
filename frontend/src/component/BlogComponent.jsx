import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useTheme } from '../ThemeContext';
import { motion } from 'framer-motion';
import { FaUserCircle, FaThumbsUp, FaThumbsDown, FaRegComment } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export const BlogComponent = () => {
    const BASE_URL = import.meta.env.VITE_API_URL;
    const [blogs, setBlogs] = useState([]);
    const { isDarkMode } = useTheme();
    const [currentBlogIndex, setCurrentBlogIndex] = useState(0);
    const autoScrollRef = useRef(null);
    const navigate = useNavigate();

    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });

    const fetchBlogPosts = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/Blogs/posts`);
            setBlogs(response.data);
        } catch (error) {
            console.error("Error fetching blog posts:", error);
        }
    };

    useEffect(() => {
        fetchBlogPosts();
    }, []);

    useEffect(() => {
        if (blogs.length > 0) {
            autoScrollRef.current = setInterval(() => {
                setCurrentBlogIndex((prevIndex) =>
                    prevIndex === blogs.length - 1 ? 0 : prevIndex + 1
                );
            }, 5000);
        }
        return () => clearInterval(autoScrollRef.current);
    }, [blogs]);

    const handleOnclick = (blog) => {
        navigate("/blogDetails", { state: { blog } });
    };

    const handleLike = (blogId) => {
        axios.post(`${BASE_URL}/api/Blogs/posts/${blogId}/like`)
            .then(() => {
                setBlogs(blogs.map(blog =>
                    blog._id === blogId ? { ...blog, likes: (blog.likes || 0) + 1 } : blog
                ));
            })
            .catch(console.error);
    };

    const handleDislike = (blogId) => {
        axios.post(`${BASE_URL}/api/Blogs/posts/${blogId}/dislike`)
            .then(() => {
                setBlogs(blogs.map(blog =>
                    blog._id === blogId ? { ...blog, dislikes: (blog.dislikes || 0) + 1 } : blog
                ));
            })
            .catch(console.error);
    };

    return (
        <motion.div
            className="form-container"
            initial={{ opacity: 0, scale: 0.9, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -50 }}
            transition={{ duration: 0.5 }}
        >
            <section
                id="blog"
                className={`py-12 w-screen min-h-[70vh] ${
                    isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-900'
                }`}
            >
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold tracking-tight">My Blogs</h2>
                    <span className="block w-24 h-1 bg-blue-500 mx-auto mt-4 rounded-full"></span>
                </div>

                {/* Featured Blog Slider */}
                {blogs.length > 0 && (
                    <div className="max-w-4xl mx-auto mb-12 bg-white rounded-xl shadow-lg p-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900">{blogs[currentBlogIndex].title}</h2>
                        {blogs[currentBlogIndex].image && (
                            <img
                                src={blogs[currentBlogIndex].image}
                                alt={blogs[currentBlogIndex].title}
                                className="w-full h-80 object-cover rounded-lg mb-4 cursor-pointer"
                                onClick={() => handleOnclick(blogs[currentBlogIndex])}
                            />
                        )}
                        {blogs[currentBlogIndex].video && (
                            <video
                                src={blogs[currentBlogIndex].video}
                                alt={blogs[currentBlogIndex].title}
                                controls
                                muted
                                className="w-full h-80 object-cover rounded-lg mb-4 cursor-pointer"
                                onClick={() => handleOnclick(blogs[currentBlogIndex])}
                            />
                        )}
                        <div
                            className="line-clamp-4 text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: blogs[currentBlogIndex].content }}
                        />
                        <div className="flex justify-between items-center mt-6 text-gray-600">
                            <button
                                className="flex items-center hover:text-blue-600 transition duration-200"
                                onClick={() => handleLike(blogs[currentBlogIndex]._id)}
                                aria-label="Like this blog"
                            >
                                <FaThumbsUp className="mr-1 text-lg" />
                                {blogs[currentBlogIndex].likes || 0}
                            </button>
                            <button
                                className="flex items-center hover:text-red-600 transition duration-200"
                                onClick={() => handleDislike(blogs[currentBlogIndex]._id)}
                                aria-label="Dislike this blog"
                            >
                                <FaThumbsDown className="mr-1 text-lg" />
                                {blogs[currentBlogIndex].dislikes || 0}
                            </button>
                            <div className="flex items-center text-gray-500">
                                <FaRegComment className="mr-1 text-lg" />
                                {blogs[currentBlogIndex].comments?.length || 0}
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm mt-4 tracking-wide font-mono">
                            {formatDate(blogs[currentBlogIndex].createdAt)}
                        </p>
                    </div>
                )}

                {/* All Blogs Grid */}
                <div className="max-w-7xl mx-auto px-6 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {blogs.map((blog) => (
                        <div
                            key={blog._id}
                            className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-2xl hover:scale-[1.03] transform transition duration-300 ease-in-out"
                            onClick={() => handleOnclick(blog)}
                        >
                            <h3 className="text-xl font-semibold mb-4 text-gray-900">{blog.title}</h3>
                            {blog.image && (
                                <img
                                    src={blog.image}
                                    alt={blog.title}
                                    className="w-full h-48 object-cover rounded-lg mb-4"
                                />
                            )}
                            <p
                                className="line-clamp-4 text-gray-700 leading-relaxed mb-4"
                                dangerouslySetInnerHTML={{ __html: blog.content }}
                            />
                            <div className="flex justify-between text-gray-600 text-sm font-medium">
                                <span>👍 {blog.likes || 0}</span>
                                <span>💬 {blog.comments?.length || 0}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </motion.div>
    );
};
