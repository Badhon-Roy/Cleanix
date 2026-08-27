"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogDetail, defaultBlogsList, getAuthorInitial, getAuthorBgColor } from "@/lib/blogsData";
import { io } from "socket.io-client";

interface BlogSectionProps {
  initialBlogs?: BlogDetail[];
}

export default function BlogSection({ initialBlogs }: BlogSectionProps) {
  const [blogs, setBlogs] = useState<BlogDetail[]>(
    initialBlogs || defaultBlogsList
  );

  useEffect(() => {
    if (initialBlogs && initialBlogs.length > 0) {
      setBlogs(initialBlogs);
    }

    const socketUrl =
      process.env.NEXT_PUBLIC_BASE_URL?.replace("/api/v1", "") ||
      "http://localhost:5000";
    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socket.on("cms_updated", (payload: any) => {
      if (payload?.page === "blog") {
        if (payload?.action === "create" && payload?.data) {
          setBlogs((prev) => [payload.data, ...prev]);
        } else if (payload?.action === "update" && payload?.data) {
          setBlogs((prev) =>
            prev.map((b) => (b.slug === payload.data.slug ? payload.data : b))
          );
        } else if (payload?.action === "delete" && payload?.slug) {
          setBlogs((prev) => prev.filter((b) => b.slug !== payload.slug));
        }
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [initialBlogs]);

  // Display top 3 latest blogs on homepage preview section
  const displayBlogs = blogs.slice(0, 3);

  return (
    <section className="w-full bg-[#F0F2F4] text-[#001837] py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Centered Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-block border border-[#007eff]/40 text-[#007eff] font-bold text-xs tracking-wider uppercase rounded-full px-5 py-2 mb-4">
            LATEST BLOG
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[44px] font-black text-[#001837] tracking-tight uppercase">
            READ OUR LATEST CLEANING TIPS FROM BLOG
          </h2>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-8">
          {displayBlogs.map((post) => (
            <Link
              key={post?.slug || post?._id}
              href={`/blog/${post?.slug}`}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 flex flex-col justify-between transition-all duration-300 group hover:border-[#007eff]/50 hover:shadow-xl"
            >
              <div>
                {/* Feature Image */}
                <div className="relative w-full h-[260px] sm:h-[300px] rounded-2xl overflow-hidden mb-6 border border-slate-100 bg-slate-100">
                  <Image
                    src={post?.image || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80"}
                    alt={post?.title || "Cleanix Blog Article"}
                    fill
                    unoptimized
                    priority
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                {/* Date Tag */}
                <p className="text-[#007eff] font-bold text-xs uppercase tracking-wider mb-2">
                  {post?.date}
                </p>

                {/* Blog Title */}
                <h3 className="text-[#001837] font-extrabold text-xl sm:text-2xl tracking-tight mb-6 leading-snug group-hover:text-[#007eff] transition-colors line-clamp-2">
                  {post?.title}
                </h3>
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-slate-200 flex items-center justify-center">
                  {post?.author?.avatar && post.author.avatar.trim() !== "" ? (
                    <Image
                      src={post.author.avatar}
                      alt={post?.author?.name || "Author"}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className={`w-full h-full flex items-center justify-center font-bold text-xs ${getAuthorBgColor(
                        post?.author?.name
                      )}`}
                    >
                      {getAuthorInitial(post?.author?.name)}
                    </div>
                  )}
                </div>
                <span className="text-slate-600 font-semibold text-xs sm:text-sm truncate">
                  {post?.author?.name}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Blogs CTA */}
        <div className="flex justify-center mt-12 md:mt-16">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#007eff] hover:bg-[#0066ee] text-white font-extrabold text-sm tracking-wide shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-[1.03]"
          >
            <span>View All Blogs</span>
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5">
              <svg className="w-4 h-4 text-[#007eff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
