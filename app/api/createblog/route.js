import { NextResponse } from 'next/server';
import { connectDb } from '@/lib/db';
import { Blog } from '@/model/blog';

export async function POST(req) {
    connectDb()
  const { image, title, description, category, content, writer, email } = await req.json();
    if (!image || !title || !description || !category || !content) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    try {
        const newBlog = new Blog({
            image,
            title,
            description,
            category,
            content,
            writer,
            email
        });
        await newBlog.save();
        return NextResponse.json({ message: 'Blog created successfully' }, { status: 201 });
    }
    catch (error) {
        console.error('Error creating blog:', error);
        return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
    }
    

}
