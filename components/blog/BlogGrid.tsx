"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { blogsData } from "@/lib/blogsData";

export default function BlogGrid() {
  const blogsList = Object.values(blogsData);

  return (
    <section className="w-full bg-[#f0f2f4] text-[#001837] py-16 md:py-24 px-4 sm:px-6 lg:px-12 border-b border-slate-200/60">
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-16">
          <span className="inline-block border border-[#007eff]/40 text-[#007eff] font-bold text-xs tracking-wider uppercase rounded-full px-6 py-2 mb-4 bg-white/70 backdrop-blur-md shadow-2xs">
            LATEST BLOG
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-[#001837] tracking-tight leading-[1.12]">
            READ OUR LATEST <span className="text-[#007eff]">INSIGHTS</span> <br />
            FROM UPDATE BLOG
          </h2>
        </div>

        {/* 3-Column Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {blogsList.map((blog) => (
            <Link
              key={blog.slug}
              href={`/blog/${blog.slug}`}
              className="bg-white rounded-3xl p-6 shadow-xs hover:shadow-2xl border border-slate-200/60 hover:border-[#007eff]/50 transition-all duration-500 hover:-translate-y-2 group flex flex-col justify-between"
            >
              <div>
                {/* Blog Image */}
                <div className="relative w-full h-[230px] rounded-2xl overflow-hidden mb-5 bg-slate-100">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    unoptimized
                    priority
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                {/* Date Tag */}
                <span className="text-[#007eff] font-extrabold text-xs uppercase tracking-wider mb-2.5 block">
                  {blog.date}
                </span>

                {/* Title */}
                <h3 className="font-black text-xl text-[#001837] group-hover:text-[#007eff] transition-colors leading-snug mb-6 line-clamp-2">
                  {blog.title}
                </h3>
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3 mt-4">
                <div className="relative w-9 h-9 rounded-full overflow-hidden border border-slate-200 shadow-xs flex-shrink-0">
                  <Image
                    src={blog.author.avatar}
                    alt={blog.author.name}
                    fill
                    unoptimized
                    className="object-cover object-center"
                  />
                </div>
                <span className="text-slate-700 font-bold text-xs sm:text-sm">
                  {blog.author.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
