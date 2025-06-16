'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from "date-fns";
import Loader from '@/app/components/Loader';
import Navbar from '@/app/components/navbar';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { updateBlogViews } from '@/lib/updateblogviews';
import BlogViews from '@/app/components/Views';

export default function BlogDetails() {
  const params = useParams();
  const id = params?.id;
  const [user, setUser] = useState(null);
  const [blogData, setBlogData] = useState({
    title: '',
    description: '',
    content: '',
    image: '',
    views: 0,
    date: '',
    category: [],
  });
  const [loading, setLoading] = useState(true); 
  const [commentLoading, setCommentLoading] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const commentsContainerRef = useRef(null);
  const router = useRouter();

  // Scroll to bottom of comments after update
  useEffect(() => {
    if (commentsContainerRef.current) {
      commentsContainerRef.current.scrollTop = commentsContainerRef.current.scrollHeight;
    }
  }, [comments]);

  // Fetch user
  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoading(true);
    if (!token) {
      alert("Please login to access this page.");
      router.push("/login");
      return;
    }

    fetch("/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          router.push("/login");
        } else {
          setUser(data);
        }
      })
      .catch(() => {
        alert("An error occurred while fetching user data.");
        router.push("/login");
      });
  }, [router]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    alert('User logged out successfully');
    router.push("/");
    window.location.reload();
  };

  // Fetch blog data
  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        const res = await fetch('/api/blogpost', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });

        const data = await res.json();
        setBlogData(data.blog);
        setComments(data.blog.comments || []);
        setLoading(false);
      } catch (error) {
        console.error('❌ Error fetching blog:', error);
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const formatTimeAgo = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const addComment = async () => {
    if (!comment.trim()) return;

    setCommentLoading(true);
    const res = await fetch("/api/comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, comment, user: user.name }),
    });

    const data = await res.json();

    if (data.error) {
      alert("Failed to add comment: " + data.error);
    } else {
      setComments(data.blog);
      setComment('');
      alert("Comment added successfully!");
    }
    setCommentLoading(false);
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />

      <div className="bg-black text-white min-h-screen py-10 px-4">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center py-20 flex flex-col items-center justify-center min-h-[90vh]">
              <Loader />
            </div>
          ) : (
            <>
              {/* Blog Image */}
              <div className="w-full h-64 md:h-[500px] relative rounded-xl overflow-hidden shadow-xl">
                <img
                  src={blogData.image || '/fallback.jpg'}
                  alt={blogData.title}
                  className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                />
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-extrabold mt-10 mb-5 leading-tight tracking-tight text-white">
                {blogData.title || 'Untitled Blog'}
              </h1>

              {/* Categories + Date */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {blogData.category.map((cat, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-md"
                  >
                    #{cat}
                  </span>
                ))}

                {blogData.date && (
                  <span className="text-sm text-zinc-400 italic ml-auto">
                    {formatTimeAgo(blogData.date)}
                  </span>
                )}

                <BlogViews views={blogData.views} />
              </div>

              {/* Description */}
              <p className="text-lg text-zinc-300 mb-8 max-w-3xl leading-relaxed">
                {blogData.description || 'No description provided.'}
              </p>

              {/* Blog Content */}
              <div className="prose prose-invert prose-lg max-w-none leading-relaxed text-sm">
                {blogData.content || <p>Loading blog content...</p>}
              </div>

              {/* Comments Section */}
              <div className="mt-16">
                <h2 className="text-2xl font-bold mb-4 border-b border-zinc-700 pb-2">
                  Comments
                </h2>

                {/* Comments List */}
                <div
                  ref={commentsContainerRef}
                  className="max-h-60 overflow-y-auto mb-6 pr-2 flex flex-col gap-3 custom-scrollbar scroll-smooth border border-zinc-800 rounded-xl bg-zinc-950 p-4"
                >
                  {[...comments].reverse().map((comment) => {
                    const initials = comment.user
                      ?.split(" ")
                      .map((word) => word[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2);

                    return (
                      <div
                        key={comment._id}
                        className="flex items-start gap-4 bg-zinc-900 p-3 rounded-lg border border-zinc-700 shadow-sm transition hover:bg-zinc-800"
                      >
                        <Avatar className="h-10 w-10 border border-zinc-700 bg-zinc-800">
                          <AvatarFallback className="text-black text-sm">
                            {initials}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-purple-400 font-semibold">
                              {comment.user}
                            </div>
                            <span className="text-xs text-zinc-500 italic">
                              {formatTimeAgo(comment.date || comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-zinc-200 leading-relaxed mt-1">
                            {comment.comment}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add Comment */}
                <div className="bg-zinc-900 p-6 rounded-xl shadow-xl border border-zinc-800">
                  <h3 className="text-lg font-semibold mb-3 text-white">
                    Add a Comment
                  </h3>

                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your comment..."
                    rows="4"
                    className="w-full mb-4 px-4 py-2 rounded bg-zinc-800 text-white placeholder-zinc-400 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
                  ></textarea>

                  <button
                    onClick={addComment}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded font-semibold transition"
                  >
                    {commentLoading ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </div>

              {/* Back Button */}
              <div className="mt-12">
                <Link href="/blogs">
                  <Button
                    variant="outline"
                    className="text-black border-white hover:bg-white hover:text-black transition duration-200"
                  >
                    ← Back to Blogs
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
