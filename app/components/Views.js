import { Eye } from "lucide-react";

export default function BlogViews({ views }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-300 bg-zinc-800 px-3 py-1 rounded-full w-fit shadow-md">
  <Eye className="w-4 h-4 text-white" />
  <span>{views ? views : 0} views</span>
</div>
  );
}
