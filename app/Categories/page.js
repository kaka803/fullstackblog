'use client'
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from '../components/navbar';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from "date-fns";
import { Plus } from 'lucide-react';
import Link from 'next/link';
import Loader from '../components/Loader';
import { updateBlogViews } from '@/lib/updateblogviews';

const CategoriesPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to access this page.");
      router.push("/login");
      return;
    }

    // Fetch user profile
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

    // Fetch blogs
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/blog");
        const data = await res.json();
        if (data && data.data) {
          setBlogs(data.data);
          setFilteredBlogs(data.data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, [router]);

  // Extract all categories from blogs
  const allCategories = ["All", ...new Set(blogs.flatMap(blog => blog.category || []))];

  // Filter blogs when category changes
  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter(blog =>
        blog.category?.includes(selectedCategory)
      );
      setFilteredBlogs(filtered);
    }
  }, [selectedCategory, blogs]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("User logged out successfully");
    router.push("/");
    window.location.reload();
  };
  function formatTimeAgo(date) {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  }

  return (
    <>
    {loading ? (
        <div className="w-full bg-black text-white h-screen flex justify-center items-center">
          <Loader/>
        </div>
      ) : (<div>
      <Navbar user={user} onLogout={handleLogout} />

      <section className="py-14 px-6 bg-black text-white min-h-screen">
        <Link href='/createblog' className="z-20">
      <Button
      className="bg-white fixed bottom-4.5 right-4.5 z-20 active:bg-black active:border-white active:text-white  text-black border border-gray-300 hover:bg-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.35)] transition-all duration-300 px-6 py-3 text-base font-semibold rounded-2xl flex items-center gap-2"
    >
      <Plus className="w-4 h-4" />
      Create Blog
    </Button>
    </Link>
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-10">📂 Categories</h2>

        <div className="flex flex-wrap gap-4 justify-center mb-10">
          {allCategories.map((cat) => (
            <Button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              variant="outline"
              className={`rounded-full border-white text-sm transition px-4 py-2 ${
                selectedCategory === cat
                  ? "bg-black text-white border-white"
                  : "text-black hover:bg-white hover:text-black"
              }`}
            >
              #{cat}
            </Button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-zinc-400"><Loader/></p>
        ) : filteredBlogs.length === 0 ? (
          <p className="text-center text-zinc-500">No blogs found in this category.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredBlogs.map((blog, index) => (
              <a
              onClick={() => updateBlogViews(blog._id)}
               href={`/blogpost/${blog._id}`} key={index} className="no-underline">
              <Card
                key={index}
                className="bg-[#1b1b1b] rounded-2xl hover:scale-[1.01] transition overflow-hidden"
              >
                <CardContent className="p-0">
                  <img
                    src={blog.image || "/fallback.jpg"}
                    alt={blog.title}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl text-white font-bold">{blog.title}</h3>
                    <p className="text-sm text-gray-400 mt-2">
                      By {blog.writer || "Unknown"} • {formatTimeAgo(blog.date) || "Unknown time"}
                    </p>
                  </div>
                </CardContent>
              </Card>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>)
    }
    
    </>
  );
};

export default CategoriesPage;
