import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { Blog } from "@/model/blog";



export async function GET() {
  try {
await connectDb();  // zaroor await karo
    const blogs = await Blog.find({}).sort({ date: -1 });
    return NextResponse.json({ success: true, data: blogs });
    
  } catch (error) {
    console.error("GET API Error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch blogs." }, { status: 500 });
  }
}
