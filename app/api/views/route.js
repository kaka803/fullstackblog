import { connectDb } from "@/lib/db";
import { Blog } from "@/model/blog";



export async function POST(request) {
    await connectDb();
  try {
    const reqBody = await request.json();
    const { id } = reqBody;

    if (!id) {
      return new Response(JSON.stringify({ error: "Blog ID is required" }), {
        status: 400,
      });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return new Response(JSON.stringify({ error: "Blog not found" }), {
        status: 404,
      });
    }

    blog.views = Number(blog.views || 0) + 1;
    await blog.save();

    return new Response(JSON.stringify({ message: "Views updated", views: blog.views }), {
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: "Something went wrong", details: error.message }), {
      status: 500,
    });
  }
}