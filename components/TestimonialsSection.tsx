"use client";

import React from "react";
import Image from "next/image";
import { Star, Quote } from "lucide-react";

const leftTestimonials = [
  {
    id: 1,
    quote:
      "I trust them completely for consistent cleaning and careful service. Our home feels fresh every visit, and their attention to detail makes the whole process effortless every time.",
    name: "RAHIM CHOWDHURY",
    role: "Operations Manager",
    rating: "5.0",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: 2,
    quote:
      "We trust their office cleaning team completely. Desks, washrooms, and shared areas are always ready before staff arrive, helping our workplace feel organized and healthy.",
    name: "MEHEDI HASAN",
    role: "Office Operations Lead",
    rating: "5.0",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
  },
];

const rightTestimonials = [
  {
    id: 3,
    quote:
      "Their deep cleaning service gave our kitchen and bathrooms a complete reset. From booking confirmation to final walkthrough, everything was organized, thorough, and stress-free.",
    name: "SADIA RAHMAN",
    role: "Distribution Coordinator",
    rating: "5.0",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: 4,
    quote:
      "Our post-renovation cleanup was handled on schedule. Dust, debris, and hard-to-reach surfaces were managed carefully so the space was ready to use immediately.",
    name: "IMRAN KABIR",
    role: "Procurement Head",
    rating: "5.0",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="w-full bg-[#F0F2F4] text-[#001837] py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Centered Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-block border border-[#007eff]/40 text-[#007eff] font-bold text-xs tracking-wider uppercase rounded-full px-5 py-2 mb-4 ">
            OUR CLEANERS
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[44px] font-black text-[#001837] tracking-tight uppercase">
            CLIENTS TESTIMONIAL
          </h2>
        </div>

        {/* 3 Columns Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Left Column: 2 Stacked Testimonials */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-6">
            {leftTestimonials.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200/80 flex flex-col justify-between h-full hover:shadow-md transition-shadow"
              >
                <div>
                  {/* Quote Icon */}
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#007eff] mb-4">
                    <Quote className="w-6 h-6 stroke-[2.5] fill-[#007eff]" />
                  </div>

                  {/* Quote Text */}
                  <p className="text-slate-600 font-medium text-xs sm:text-sm leading-relaxed mb-6">
                    &quot;{item.quote}&quot;
                  </p>
                </div>

                {/* Author Info Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-slate-200">
                      <Image
                        src={item.avatar}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-[#001837] font-extrabold text-xs sm:text-sm tracking-wide uppercase">
                        {item.name}
                      </h4>
                      <p className="text-slate-500 text-[11px] font-medium">
                        {item.role}
                      </p>
                    </div>
                  </div>

                  {/* Rating Badge */}
                  <div className="flex items-center gap-1 bg-slate-100/80 px-2.5 py-1 rounded-full text-[#007eff] font-extrabold text-xs">
                    <Star className="w-3.5 h-3.5 fill-[#007eff]" />
                    <span>{item.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Center Column: Featured Cleaner Image Card with Seamless Gradient Blend */}
          <div className="lg:col-span-4 relative min-h-[520px] sm:min-h-[580px] rounded-3xl overflow-hidden flex flex-col justify-end">
            {/* Background Cleaner PNG Image */}
            <div className="absolute inset-0 w-full h-full">
              <Image
                src="https://framerusercontent.com/images/5PP2Nh5YzhkXpjpYWhh3BlOZ6n0.png?width=547&height=789"
                alt="Professional Male Cleaner"
                fill
                priority
                className="object-contain object-bottom pt-2"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              {/* Ultra-Smooth Bottom-to-Top Gradient Fade (No hard edges, 100% smooth blend into light background) */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#001837] via-[#001837]/75 via-28% to-transparent to-55% pointer-events-none" />
            </div>

            {/* Bottom Dark Navy Rating Box */}
            <div className="relative z-10 p-6 text-white rounded-b-3xl">
              <div className="flex items-center gap-3">
                {/* Google G logo */}
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-black text-xl text-[#4285F4] flex-shrink-0 shadow-sm">
                  G
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-black text-xl sm:text-2xl tracking-tight">
                      4.9/5.0
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="flex items-center gap-0.5 text-[#007eff]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#007eff]" />
                      ))}
                    </div>
                    <span className="text-slate-300 font-bold text-[10px] tracking-wider uppercase ml-1">
                      (5K REVIEWS)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 2 Stacked Testimonials */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-6">
            {rightTestimonials.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200/80 flex flex-col justify-between h-full hover:shadow-md transition-shadow"
              >
                <div>
                  {/* Quote Icon */}
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#007eff] mb-4">
                    <Quote className="w-6 h-6 stroke-[2.5] fill-[#007eff]" />
                  </div>

                  {/* Quote Text */}
                  <p className="text-slate-600 font-medium text-xs sm:text-sm leading-relaxed mb-6">
                    &quot;{item.quote}&quot;
                  </p>
                </div>

                {/* Author Info Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-slate-200">
                      <Image
                        src={item.avatar}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-[#001837] font-extrabold text-xs sm:text-sm tracking-wide uppercase">
                        {item.name}
                      </h4>
                      <p className="text-slate-500 text-[11px] font-medium">
                        {item.role}
                      </p>
                    </div>
                  </div>

                  {/* Rating Badge */}
                  <div className="flex items-center gap-1 bg-slate-100/80 px-2.5 py-1 rounded-full text-[#007eff] font-extrabold text-xs">
                    <Star className="w-3.5 h-3.5 fill-[#007eff]" />
                    <span>{item.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
