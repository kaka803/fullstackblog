import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { Blog } from "@/model/blog";


// Connect to the database
connectDb();

export async function POST(req) {
  
  const {id, comment, user} = await req.json();
  await connectDb()
    try {
        // Find the blog post by ID
        const blog = await Blog.findById(id);
        if (!blog) {
            return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
        }
        // Add the comment to the blog post
        blog.comments.push({ comment, user });
        // Save the updated blog post
        await blog.save();
        // return NextResponse.json({ message: "Comment added successfully" }, { status: 200 });
        const updateblog = await Blog.findById(id);
        if (!updateblog) {
            return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
        }
        return NextResponse.json({ blog: updateblog.comments }, { status: 200 });
    } catch (error) {
        console.error("Error adding comment:", error);
        return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
    }
    
}
