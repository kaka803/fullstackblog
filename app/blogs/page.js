'use client'
import React from 'react'
import { Card, CardContent } from "@/components/ui/card";
import Navbar from '../components/navbar';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { formatDistanceToNow } from "date-fns";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Loader from '../components/Loader';
import BlogViews from '../components/Views';
import { updateBlogViews } from '@/lib/updateblogviews';



const blog = () => {
  const router = useRouter();
      const [user, setUser] = useState(null); 
      const [blogs, setBlogs] = useState([]);
      const [loading, setLoading] = useState(false); // State to manage loading

      useEffect(() => {
        const token = localStorage.getItem("token");
        setLoading(true)
        if (!token) {
          alert("Please login to access this page.");
          router.push("/login");
          return;
        }
    
        fetch("/api/profile", {  // backend api route ka naam change kar sakte ho
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
              console.log("User data:", data); // Debugging line to check user data
            }
          })
          .catch(() => {
            alert("An error occurred while fetching user data.");
            router.push("/login");
          });
      }, [router]);
    
      const handleLogout = () => {
        localStorage.removeItem("token");
        alert('user logout successfully')  // correct method
        router.push("/"); 
        window.location.reload()             // logout ke baad redirect
      };



      useEffect(() => {
  const fetchBlogs = async () => {
    try {
      setLoading(true); // Set loading to true before fetching
      const res = await fetch("/api/blog");
      const data = await res.json()
      if (data) {
        console.log("Fetched blogs:", data.data)
        setBlogs(data.data);
        setLoading(false)
      } else {
        console.error("Failed to fetch blogs");
      }
      setLoading(false); // Set loading to false after fetching
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }

  };

  fetchBlogs();
}, []);

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
      <Link href='/createblog' className="z-20">
      <Button
      className="bg-white fixed bottom-4.5 right-4.5 z-20 active:bg-black active:border-white active:text-white  text-black border border-gray-300 hover:bg-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.35)] transition-all duration-300 px-6 py-3 text-base font-semibold rounded-2xl flex items-center gap-2"
    >
      <Plus className="w-4 h-4" />
      Create Blog
    </Button>
    </Link>
      <Navbar
                    user={user}
                    onLogout={handleLogout}  
                    />
      <section className="pb-14 px-6 min-h-screen bg-black text-white flex flex-col items-center justify-start">
  <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-10 tracking-tight leading-tigh mt-7.5">
   All Blogs
</h2>

{
  loading ? (
    <div className="text-center py-20">
      <p className="text-zinc-400 mt-2"><Loader/></p>
    </div>
  ) : (

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
  {blogs.map((blog, index) => (
    <a
    onClick={() => updateBlogViews(blog._id)}
     href={ `/blogpost/${blog._id}`} as={`blogpost/${blog._id}`} key={blog._id}>
      <Card
    
        key={index}
        className="bg-[#1b1b1b] rounded-2xl hover:scale-[1.01] transition overflow-hidden"
      >
        <CardContent className="p-0">
          <img
            src={blog.image}
            alt={blog.title}
            className="h-50 w-full object-cover relative top-[-27px]"
          />
          <div className="p-4">
            <h3 className="text-xl text-white font-bold">{blog.title}</h3>
            <p className="text-sm text-gray-400 mt-2 mb-2">
              By {blog.writer} • {formatTimeAgo(blog.date)}
            </p>
            <BlogViews
            views={blog.views}
            />
          </div>
        </CardContent>
      </Card>
      </a>
    ))}
  </div>
  )
}

  
</section>
    </div>)
    }
    
    </>
  )
}

export default blog
