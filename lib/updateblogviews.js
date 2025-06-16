// lib/updateViews.js

export async function updateBlogViews(blogId) {
  try {
    const response = await fetch("/api/views", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: blogId }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Failed to update views:", data);
    } else {
      console.log("Views updated to:", data.views);
    }
  } catch (error) {
    console.error("Error updating views:", error.message);
  }
}
