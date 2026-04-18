import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - Artify",
  description:
    "Stay updated with the latest trends, tips, and insights from the world of graphic design from Artify's expert team.",
  keywords: ["design blog", "graphic design tips", "design trends", "creative inspiration"],
};

const blogPosts = [
  {
    id: 1,
    title: "The Future of Brand Identity Design in 2026",
    excerpt:
      "Exploring emerging trends in brand identity, from dynamic logos to AI-assisted design systems.",
    date: "May 15, 2026",
    author: "Sarah Johnson",
    category: "Branding",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "10 UI/UX Mistakes That Are Killing Your Conversions",
    excerpt:
      "Common user experience pitfalls and how to fix them to improve engagement and conversion rates.",
    date: "May 10, 2026",
    author: "Michael Chen",
    category: "UI/UX",
    readTime: "8 min read",
  },
  {
    id: 3,
    title: "Sustainable Design Practices for a Greener Future",
    excerpt:
      "How graphic designers can reduce their environmental footprint while delivering exceptional work.",
    date: "May 5, 2026",
    author: "Amaka Okafor",
    category: "Sustainability",
    readTime: "6 min read",
  },
  {
    id: 4,
    title: "Building a Design System from Scratch",
    excerpt:
      "A comprehensive guide to creating scalable design systems that maintain consistency across products.",
    date: "April 28, 2026",
    author: "David Adeyemi",
    category: "Design Systems",
    readTime: "10 min read",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Design Insights
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Tips, trends, and thoughts from the Artify team on design, creativity, and business.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700"
            >
              {/* Placeholder Image */}
              <div className="h-48 bg-gradient-to-br from-teal-400 to-purple-500 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white/20 text-6xl font-bold">A</span>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-semibold">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>

                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer">
                  {post.title}
                </h2>

                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    By {post.author}
                  </span>
                  <button className="text-teal-600 dark:text-teal-400 font-semibold hover:text-teal-700 dark:hover:text-teal-300 transition-colors flex items-center gap-2">
                    Read more
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 max-w-2xl mx-auto bg-gradient-to-r from-teal-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Stay in the Loop</h2>
          <p className="mb-6 opacity-90">
            Get the latest design tips and insights delivered to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-teal-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
