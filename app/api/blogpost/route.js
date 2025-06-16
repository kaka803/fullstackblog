import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { Blog } from "@/model/blog";
import mongoose from "mongoose";


// Connect to the database
connectDb();

export async function POST(req) {
  
  const {id} = await req.json();
  await connectDb()
    if(!id){
      return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
    }
    try {
      const blog = await Blog.findById(id)
      if (!blog) {
        return NextResponse.json({ error: "Blog not found" }, { status: 404 });
      }
      return NextResponse.json({blog}, { status: 200 });
    } catch (e) {
      console.log(e)
    }

    
}
