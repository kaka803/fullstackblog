'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, Plus } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from "../components/navbar";

export default function CreateBlogForm() {
  const router = useRouter();

  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState([]);
  const [content, setContent] = useState("");
  const [user, setUser] = useState(null);

  // ✅ Get Logged-in User
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to access this page.");
      router.push("/login");
      return;
    }

    fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    alert('User logged out successfully');
    router.push("/");
    window.location.reload();
  };

  // ✅ Create Blog
  const createBlog = async () => {
    if (!image || !title || !description || !category.length || !content) {
      alert("Please fill in all fields.");
      return;
    }

    const blogData = {
      image,
      title,
      description,
      category,
      content,
      writer: user?.name || "Unknown",
      email: user?.email || "Not Provided",
    };

    try {
      const res = await fetch("/api/createblog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData),
      });

      const data = await res.json();
      alert(data.message || "Blog created successfully!");
      alert("Now you can see your blog in the blogs section.");

      // ✅ Reset Form
      setImage('');
      setTitle('');
      setDescription('');
      setCategory([]);
      setContent('');
    } catch (err) {
      alert("Something went wrong while creating blog.");
    }
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />

      <div className="max-w-full mx-auto p-6 bg-black text-white shadow-lg space-y-6">
        <h2 className="text-3xl font-bold text-center">Create New Blog</h2>

        {/* Blog Image */}
        <div className="space-y-2">
          <Label htmlFor="image">Blog Image URL</Label>
          <Input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            id="image"
            type="text"
            placeholder="Enter image URL"
            className="bg-zinc-900 border-zinc-700 text-white"
          />
        </div>

        {/* Blog Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Blog Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            id="title"
            type="text"
            placeholder="Enter blog title"
            className="bg-zinc-900 border-zinc-700 text-white"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Short Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            id="description"
            placeholder="Write a short description..."
            className="bg-zinc-900 border-zinc-700 text-white min-h-[80px]"
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">Select Category</Label>
          <select
            id="category"
            multiple
            value={category}
            onChange={(e) =>
              setCategory(Array.from(e.target.selectedOptions, (opt) => opt.value))
            }
            className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="Tech">Tech</option>
            <option value="Freelancing">Freelancing</option>
            <option value="AI Tools">AI Tools</option>
            <option value="Productivity">Productivity</option>
            <option value="Design">Design</option>
          </select>
          <p className="text-sm text-gray-400">
            Hold Ctrl (Cmd on Mac) to select multiple categories.
          </p>
        </div>

        {/* Blog Content */}
        <div className="space-y-2">
          <Label htmlFor="content">Full Blog Content</Label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            id="content"
            placeholder="Write your full blog here..."
            className="bg-zinc-900 border-zinc-700 text-white min-h-[160px]"
          />
        </div>

        {/* Submit */}
        <div className="text-center pt-4">
          <Button
            onClick={createBlog}
            className="bg-white text-black hover:bg-gray-200 active:scale-95 rounded-xl px-6 py-3 font-semibold text-base flex items-center gap-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            Create Blog
          </Button>
        </div>
      </div>
    </>
  );
}
