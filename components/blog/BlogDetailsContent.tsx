"use client";

import React from "react";
import Image from "next/image";
import { BlogDetail, getAuthorInitial, getAuthorBgColor } from "@/lib/blogsData";

interface Props {
  blog: BlogDetail;
}

export default function BlogDetailsContent({ blog }: Props) {
  return (
    <article className="w-full bg-[#f4f6f9] text-[#001837] py-16 md:py-24 px-4 sm:px-6 lg:px-12 border-b border-slate-200/80">
      <div className="container mx-auto max-w-7xl">
        {/* 1. Main Uppercase Title (Centered) */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-black uppercase text-[#001837] text-center mb-6 leading-tight tracking-tight max-w-4xl mx-auto">
          {blog?.title}
        </h1>

        {/* 2. Author & Date Meta Bar */}
        <div className="flex items-center justify-between max-w-4xl mx-auto mb-8 px-2 border-b border-slate-200/60 pb-6">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-slate-300 shadow-xs flex-shrink-0 flex items-center justify-center">
              {blog?.author?.avatar && blog.author.avatar.trim() !== "" ? (
                <Image
                  src={blog.author.avatar}
                  alt={blog?.author?.name || "Author"}
                  fill
                  unoptimized
                  className="object-cover object-center"
                />
              ) : (
                <div
                  className={`w-full h-full flex items-center justify-center font-bold text-xs ${getAuthorBgColor(
                    blog?.author?.name
                  )}`}
                >
                  {getAuthorInitial(blog?.author?.name)}
                </div>
              )}
            </div>
            <span className="text-slate-800 font-extrabold text-sm sm:text-base">
              {blog?.author?.name}
            </span>
          </div>

          <span className="text-[#007eff] font-black text-xs sm:text-sm uppercase tracking-wider">
            {blog?.date}
          </span>
        </div>

        {/* 3. Hero Article Featured Image */}
        <div className="relative w-full max-w-4xl mx-auto h-[360px] sm:h-[460px] md:h-[500px] rounded-3xl overflow-hidden shadow-xl mb-12 border border-slate-200/80 bg-slate-100">
          {blog?.image && (
            <Image
              src={blog.image}
              alt={blog?.title || "Blog Image"}
              fill
              unoptimized
              priority
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 80vw"
            />
          )}
        </div>

        {/* 4. Article Reading Body */}
        <div className="max-w-5xl mx-auto space-y-10 text-slate-700 text-base sm:text-lg leading-relaxed font-normal">
          {/* Intro Paragraph */}
          <p className="text-slate-700 font-medium text-base sm:text-lg leading-relaxed">
            {blog?.introParagraph}
          </p>

          {/* Dynamic Article Sections */}
          {blog?.sections?.map((section, idx) => (
            <div key={idx} className="space-y-4 pt-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold uppercase text-[#001837] tracking-tight">
                {section?.title}
              </h2>
              {section?.paragraphs?.map((p, pIdx) => (
                <p key={pIdx} className="text-slate-600 font-normal">
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
