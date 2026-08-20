"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";

interface ImageSlide {
  type: "image";
  name: string;
  url: string;
}

interface CustomSlide {
  type: "custom";
  name: string;
  component: React.ReactNode;
}

type SlideItem = ImageSlide | CustomSlide;

const clientLogos = [
  {
    name: "Constre",
    url: "https://framerusercontent.com/images/COqswyjp3SuEhNP6bzN6U0kuNYM.jpg?width=252&height=140",
  },
  {
    name: "Arkitex",
    url: "https://framerusercontent.com/images/7JKlhEV8Rjql8BwvIekWYd0MchQ.jpg?width=252&height=140",
  },
  {
    name: "Buildy",
    url: "https://framerusercontent.com/images/0uCQ9zPZeEkwJhqlRVwfHZDfXs.jpg?width=252&height=140",
  },
  {
    name: "Homex",
    url: "https://framerusercontent.com/images/i8njOZpJktCMxMu8QL3gGaA.jpg?width=252&height=140",
  },
];

export function ArchisLogo() {
  return (
    <div className="flex items-center justify-center gap-3 w-full h-full">
      <div className="w-8 h-8 flex items-center justify-center text-[#00a86b] flex-shrink-0">
        <svg viewBox="0 0 32 32" fill="currentColor" className="w-8 h-8">
          <path d="M16 4L22 10L16 16L10 10L16 4Z" />
          <path d="M16 16L22 22L16 28L10 22L16 16Z" />
          <path d="M4 16L10 10L16 16L10 22L4 16Z" opacity="0.6" />
          <path d="M16 16L22 10L28 16L22 22L16 16Z" opacity="0.6" />
        </svg>
      </div>
      <span className="text-[#091d3e] font-extrabold text-base md:text-lg tracking-wider font-sans">
        ARCHIS
      </span>
    </div>
  );
}

export default function TrustedClients() {
  const allSlides: SlideItem[] = [
    ...clientLogos.map((logo): ImageSlide => ({ type: "image", ...logo })),
    { type: "custom", name: "Archis", component: <ArchisLogo /> },
    ...clientLogos.map((logo): ImageSlide => ({ type: "image", ...logo })),
    { type: "custom", name: "Archis 2", component: <ArchisLogo /> },
  ];

  return (
    <section className="w-full bg-white py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header Text with Left/Right Dividers */}
        <div className="flex items-center justify-center gap-4 md:gap-6 mb-8 md:mb-10">
          <div className="h-[1px] bg-slate-200 flex-1 max-w-[200px] sm:max-w-xs hidden sm:block" />
          <p className="text-slate-700 text-sm sm:text-base lg:text-2xl font-semibold tracking-tight text-center">
            <span className="text-[#007eff] font-extrabold">10,000+</span>{" "}
            trusted customers all over the world
          </p>
          <div className="h-[1px] bg-slate-200 flex-1 max-w-[200px] sm:max-w-xs hidden sm:block" />
        </div>

        {/* Outer Light Gray Container */}
        <div className="w-full bg-[#f1f4f8] rounded-2xl md:rounded-[24px] p-3 sm:p-4 border border-slate-200/70 shadow-xs overflow-hidden">
          {/* Swiper Continuous Slider */}
          <Swiper
            modules={[Autoplay]}
            spaceBetween={16}
            slidesPerView={2}
            loop={true}
            speed={3500}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              480: {
                slidesPerView: 3,
                spaceBetween: 14,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 16,
              },
              1024: {
                slidesPerView: 5,
                spaceBetween: 16,
              },
            }}
            className="w-full !ease-linear"
          >
            {allSlides.map((slide, index) => (
              <SwiperSlide key={index}>
                <div className="bg-white rounded-xl sm:rounded-2xl h-24 sm:h-28 flex items-center justify-center p-2 border border-slate-100/90 transition-shadow relative overflow-hidden">
                  {slide.type === "image" ? (
                    <div className="relative w-full h-full rounded-lg overflow-hidden">
                      <Image
                        src={slide.url}
                        alt={slide.name}
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 768px) 50vw, 20vw"
                      />
                    </div>
                  ) : (
                    slide.component
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
