'use client'
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Upload, Plus } from "lucide-react"
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from "@/app/components/navbar"
import { useParams } from "next/navigation"
import Loader from "@/app/components/Loader"
export default function CreateBlogForm() {
    const router = useRouter();
    const [image, setImage] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState([]);
    const [content, setContent] = useState("");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [blogs, setBlogs] = useState([])
      const [blogData, setBlogData] = useState({
          title: '',
          description: '',
          content: '',
          image: '',
        });

const params = useParams();
      const id = params?.id;

      useEffect(() => {
          if (!id) return;
      
          const fetchBlog = async () => {
            setLoading(true)
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
              setLoading(false);
              console.log(data.blog);
              
                   setLoading(false)
            } catch (error) {
              console.error('❌ Error fetching blog:', error);
              setLoading(false);
            }
          };
      
          fetchBlog();
        }, [id]);
        
    useEffect(() => {
        const token = localStorage.getItem("token");
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
  setImage(blogData.image);
  setTitle(blogData.title);
  setContent(blogData.content);
  setDescription(blogData.description);

  deleteBlog(blogData._id); // This line is fine

}, [blogData]);
    

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
            writer: user.name,
            email: user.email, // Assuming user object has a name property
        };

        const res = await fetch("/api/createblog", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(blogData),
        });

        const data = await res.json();
        alert('blog updated');
        alert("now you can see your blog in the blogs section")
        setImage('')
        setTitle('')
        setDescription('')
        setCategory([])
        setContent('')
router.push("/dashboard");


    }

const deleteBlog = async (id) => {
    const res = fetch("/api/deleteblog", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        })
        if(res){
           setBlogs(blogs.filter((e) => e._id !== id))
            console.log('blogdeleted');
            
        }
        else{
            console.log('erorr')
        }
}
    return (
        <>
        <Navbar
            user={user}
            onLogout={handleLogout}
        />
        {loading ? (
        <div className="w-full bg-black text-white h-screen flex justify-center items-center">
          <Loader/>
        </div>
      ) : (<div className="max-w-screen mx-auto p-6 bg-black text-white shadow-lg space-y-6">
                <h2 className="text-3xl font-bold text-center">Create New Blog</h2>

                {/* Image Upload */}
                <div className="space-y-2">
                    <Label htmlFor="image" className="text-white">Blog Image URL</Label>
                    <Input
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        id="image" type="text" placeholder="Image URL" className="bg-zinc-900 mt-1 border-zinc-700 text-white" />
                </div>

                {/* Title */}
                <div className="space-y-2">
                    <Label htmlFor="title" className="text-white">Blog Title</Label>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        id="title" type="text" placeholder="Enter blog title" className="bg-zinc-900 mt-1 border-zinc-700 text-white" />
                </div>

                {/* Short Description */}
                <div className="space-y-2">
                    <Label htmlFor="description" className="text-white">Short Description</Label>
                    <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        id="description" placeholder="Enter short description..." className="bg-zinc-900 mt-1 border-zinc-700 text-white min-h-[80px]" />
                </div>

                {/* Category Selection */}
                <div className="space-y-2">
                    <Label htmlFor="category" className="text-white">Select Category</Label>
                    <select
                        id="category"
                        multiple
                        className="w-full bg-zinc-900 mt-1 border border-zinc-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        onChange={(e) => {
                            const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
                            setCategory(selected);
                        }}
                    >
                        <option value="Tech">Tech</option>
                        <option value="Freelancing">Freelancing</option>
                        <option value="AI Tools">AI Tools</option>
                        <option value="Productivity">Productivity</option>
                        <option value="Design">Design</option>
                    </select>

                    <p className="text-sm text-gray-400">You can select multiple categories by holding Ctrl (Cmd on Mac)</p>
                </div>

                {/* Blog Content */}
                <div className="space-y-2">
                    <Label htmlFor="content" className="text-white">Full Blog Content</Label>
                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        id="content" placeholder="Write your full blog here..." className="bg-zinc-900 mt-1 border-zinc-700 text-white min-h-[160px]" />
                </div>

                {/* Create Button */}
                <div className="text-center">
                    <Button
                        onClick={() => createBlog()}
                        className="bg-white text-black hover:bg-gray-200 active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.25)] active:shadow-[0_2px_6px_rgba(0,0,0,0.4)] transition-all duration-200 rounded-xl px-6 py-3 font-semibold text-base flex items-center gap-2 mx-auto"
                    >
                        <Plus className="w-4 h-4" />
                        update Blog
                    </Button>
                </div>
            </div>)
    }
            

        </>
    )
}
