'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar";
import Loader from "../components/Loader";

export default function BlogDashboard() {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
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
        alert("Failed to fetch user.");
        router.push("/login");
      });
  }, [router]);

  useEffect(() => {
    if (!user?.name) return;

    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/blog");
        const data = await res.json();
        const userBlogs = data.data.filter((e) => e.writer === user.name);
        setBlogs(userBlogs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [user]);

  const deleteBlog = async (id) => {
    try {
      const res = await fetch("/api/deleteblog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        window.location.reload();
      } else {
        console.log("Failed to delete blog");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleEdit = (id) => {
    router.push(`/editblog/${id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("User logged out successfully");
    router.push("/");
    window.location.reload();
  };

  return (
    <>
      {loading ? (
        <div className="w-full bg-black text-white h-screen flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <main className="min-h-screen bg-black text-white">
          <Navbar user={user} onLogout={handleLogout} />

          <div className="max-w-screen px-7 mt-7 mx-auto">
            <h1 className="text-4xl font-bold mb-10 text-center">
              📝 Blog Dashboard
            </h1>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <Card
                  key={blog._id}
                  className="bg-[#111] border border-gray-800 text-white hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden rounded-xl"
                >
                  <img
                    src={blog.image || "/fallback.jpg"}
                    alt={blog.title}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                  <CardContent className="p-4 space-y-3">
                    <h2 className="text-lg font-semibold">{blog.title}</h2>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleEdit(blog._id)}
                        variant="secondary"
                        className="w-1/2"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => deleteBlog(blog._id)}
                        variant="destructive"
                        className="w-1/2"
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      )}
    </>
  );
}
