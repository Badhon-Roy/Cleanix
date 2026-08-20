"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const blogPosts = [
  {
    id: 1,
    date: "MAY 2, 2025",
    title: "How Regular Cleaning Improves Comfort",
    author: "CleanPro Editorial Team",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80",
    image:
      "https://framerusercontent.com/images/w3rFcL3VLh82f7jpfjhc8m9URI.png?width=456&height=320",
    link: "#blog-1",
  },
  {
    id: 2,
    date: "MAY 2, 2025",
    title: "Top 10 Ways to Keep Offices Fresh",
    author: "CleanPro Editorial Team",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80",
    image:
      "https://framerusercontent.com/images/bz3VDji8Bg5aJ3o2tf8soexxxI.png?width=456&height=320",
    link: "#blog-2",
  },
];

export default function BlogSection() {
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

        {/* 2 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              href={post.link}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 flex flex-col justify-between  transition-all duration-300 group"
            >
              <div>
                {/* Feature Image */}
                <div className="relative w-full h-[260px] sm:h-[300px] rounded-2xl overflow-hidden mb-6 border border-slate-100">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    priority
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                {/* Date Tag */}
                <p className="text-[#007eff] font-bold text-xs uppercase tracking-wider mb-2">
                  {post.date}
                </p>

                {/* Blog Title */}
                <h3 className="text-[#001837] font-extrabold text-xl sm:text-2xl tracking-tight mb-6 leading-snug group-hover:text-[#007eff] transition-colors">
                  {post.title}
                </h3>
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-slate-200">
                  <Image
                    src={post.avatar}
                    alt={post.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-slate-600 font-semibold text-xs sm:text-sm">
                  {post.author}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
