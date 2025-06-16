import { connectDb } from "@/lib/db";
import { Blog } from "@/model/blog";
import { NextResponse } from "next/server";

export async function POST(req) {
  const {id} = await req.json();


  await connectDb();

  try {
    if (id) {
      const result = await Blog.deleteOne({ _id: id });

      if (result.deletedCount === 0) {
        return NextResponse.json({ message: "No blog found with that ID" }, { status: 404 });
      }

      console.log("Blog deleted successfully");
      return NextResponse.json({ message: "Blog deleted successfully" });
    }

    return NextResponse.json({ message: "ID not found" }, { status: 400 });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
