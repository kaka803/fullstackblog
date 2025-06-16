'use client';
import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import Navbar from './components/navbar';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import Loader from './components/Loader';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import BlogViews from './components/Views';
import { updateBlogViews } from '@/lib/updateblogviews';

export default function HomePage() {
  const [blogs, setBlogs] = useState([]);
  const [latestblogs, setLatestBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/');

    fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) router.push('/');
        else setUser(data);
      })
      .catch(() => router.push('/'));
  }, [router]);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/blog');
        const data = await res.json();
        if (data && data.data) {
          setBlogs(data.data);
          setLatestBlogs(data.data.slice(0, 2));
        }
      } catch (err) {
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
    window.location.reload();
  };

  const formatTimeAgo = date => formatDistanceToNow(new Date(date), { addSuffix: true });

  const allCategories = ['All', ...new Set(blogs.flatMap(blog => blog.category || []))];

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter(blog =>
        blog.category?.includes(selectedCategory)
      );
      setFilteredBlogs(filtered);
    }
  }, [selectedCategory, blogs]);

  return loading ? (
    <div className="w-full bg-black text-white h-screen flex justify-center items-center">
      <Loader />
    </div>
  ) : (
    <div className="min-h-screen bg-[#0f0f0f] text-white font-sans relative">
      <Navbar user={user} onLogout={handleLogout} />

      <Link href="/createblog" className="z-20">
        <Button className="bg-white fixed bottom-4.5 right-4.5 z-20 text-black border border-gray-300 hover:bg-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.35)] transition-all duration-300 px-6 py-3 text-base font-semibold rounded-2xl flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Blog
        </Button>
      </Link>

      {/* Hero */}
      <section className="text-center min-h-[90vh] py-20 px-6 flex flex-col items-center justify-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold mb-4"
        >
          Explore Ideas, Tech & Freelancing Tips
        </motion.h1>
        <p className="text-lg md:text-xl text-gray-400 mb-6">
          Real stories, expert blogs, and smart resources to grow.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/blogs">
            <Button className="bg-white text-black px-6 py-2 text-lg rounded-2xl hover:bg-gray-200">
              Explore Blogs
            </Button>
          </Link>
          <Link href="/createblog">
            <Button className="bg-transparent border border-white text-white px-6 py-2 text-lg rounded-2xl hover:bg-white hover:text-black">
              Start Writing
            </Button>
          </Link>
        </div>
      </section>

      {/* Trending Blogs */}
      <section className="pb-14 px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-10 tracking-tight leading-tight">
          🔥 Trending Blogs
        </h2>
        <Carousel className="min-w-[90vw] mx-auto relative" plugins={[plugin.current]}>
          <CarouselContent>
            {[...blogs]
              .sort((a, b) => b.views - a.views)
              .map((blog, index) => (
                <CarouselItem
                  key={blog._id || index}
                  className="basis-full sm:basis-1/2 md:basis-1/3 cursor-pointer"
                >
                  <Link
                    href={`/blogpost/${blog._id}`}
                    onClick={() => updateBlogViews(blog._id)}
                  >
                    <Card className="bg-[#1b1b1b] m-2 rounded-2xl hover:scale-[1.01] transition-transform duration-200 overflow-hidden shadow-lg">
                      <CardContent className="p-0">
                        <img
                          src={blog.image}
                          alt={blog.title}
                          loading="lazy"
                          className="w-full aspect-[16/9] object-cover"
                        />
                        <div className="p-4">
                          <h3 className="text-xl font-bold text-white">{blog.title}</h3>
                          <p className="text-sm text-gray-400 my-2">
                            By {blog.writer} • {formatTimeAgo(blog.date)}
                          </p>
                          <BlogViews views={blog.views} />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
          </CarouselContent>
          <div className="w-full flex justify-center items-center">
            <CarouselPrevious className="text-black relative top-[36px]" />
            <CarouselNext className="text-black relative top-[36px]" />
          </div>
        </Carousel>
      </section>

      {/* Categories */}
      <section className="py-14 px-6 bg-black text-white min-h-screen">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-10">📂 Categories</h2>
        <div className="flex flex-wrap gap-4 justify-center mb-10">
          {allCategories.map(cat => (
            <Button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              variant="outline"
              className={`rounded-full border-white text-sm transition px-4 py-2 ${
                selectedCategory === cat
                  ? 'bg-black text-white border-white'
                  : 'text-black hover:bg-white hover:text-black'
              }`}
            >
              #{cat}
            </Button>
          ))}
        </div>
        {filteredBlogs.length === 0 ? (
          <p className="text-center text-zinc-500">No blogs found in this category.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredBlogs.slice(0, 3).map(blog => (
              <Link
                key={blog._id}
                href={`/blogpost/${blog._id}`}
                onClick={() => updateBlogViews(blog._id)}
              >
                <Card className="bg-[#1b1b1b] rounded-2xl hover:scale-[1.01] transition overflow-hidden">
                  <CardContent className="p-0">
                    <img
                      src={blog.image || '/fallback.jpg'}
                      alt={blog.title}
                      className="h-48 w-full object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-xl text-white font-bold">{blog.title}</h3>
                      <p className="text-sm text-gray-400 my-2">
                        By {blog.writer} • {formatTimeAgo(blog.date)}
                      </p>
                      <BlogViews views={blog.views} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Latest Blogs */}
      <section className="py-14 px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-10 tracking-tight leading-tight">
          🆕 Latest Blogs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {latestblogs.map(blog => (
            <Link
              key={blog._id}
              href={`/blogpost/${blog._id}`}
              onClick={() => updateBlogViews(blog._id)}
            >
              <Card className="bg-[#1b1b1b] rounded-2xl">
                <CardContent className="p-4">
                  <img
                    src={blog.image}
                    alt="blog image"
                    className="h-50 w-full object-cover relative top-[-27px]"
                  />
                  <div className="p-4">
                    <h3 className="text-xl text-white font-bold">{blog.title}</h3>
                    <p className="text-sm text-gray-400 my-2">
                      By {blog.writer} • {formatTimeAgo(blog.date)}
                    </p>
                    <BlogViews views={blog.views} />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="py-14 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-4">🚀 What is InsightVerse?</h2>
        <p className="text-gray-400 max-w-xl mx-auto">
          InsightVerse is built for young learners, freelancers & creators who want actionable, clutter-free knowledge in one place.
        </p>
      </section>

      {/* Newsletter */}
      <section className="py-14 px-6 bg-[#1a1a1a]">
        <h2 className="text-3xl font-semibold mb-4 text-center">📬 Stay Updated</h2>
        <p className="text-center text-gray-400 mb-6">Get top blogs delivered weekly to your inbox.</p>
        <div className="max-w-md mx-auto flex gap-2">
          <Input placeholder="Enter your email" className="bg-[#2c2c2c] border-none text-white" />
          <Button className="bg-white text-black hover:bg-gray-300">Subscribe</Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-sm text-gray-500">
        &copy; 2025 InsightVerse. Built with ❤️ by Hassnain.
      </footer>
    </div>
  );
}
