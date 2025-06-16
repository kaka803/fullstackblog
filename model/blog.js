import { Type } from "lucide-react";
import mongoose from "mongoose";
const commentSchema = new mongoose.Schema({
  user: String,
  comment: String,
}, { timestamps: true });



const BlogSchema = new mongoose.Schema({
  image: String,
  title: String,
  description: String,
  category: {
    type: [String],
    enum: ["Tech", "Freelancing", "AI Tools", "Productivity", "Design"]
  },
  content: String,
  date: {
    type: Date,
    default: Date.now
  },
  writer: String,
  email: String,
  comments: [commentSchema],
  views: {
    type: Number,
    default: 0,
  },
});

// 🧼 Clear cached model in dev environments
if (mongoose.models.Blog) {
  delete mongoose.models.Blog;
}

export const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
