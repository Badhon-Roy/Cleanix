"use client";

import React from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { ProjectDetail } from "@/lib/projectsData";

interface Props {
  project: ProjectDetail;
}

export default function ProjectDetailsContent({ project }: Props) {
  return (
    <article className="w-full space-y-10 text-[#001837]">
      {/* 1. Top Featured Hero Image */}
      <div className="relative w-full h-[360px] sm:h-[440px] md:h-[480px] rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 bg-slate-100">
        <Image
          src={project?.heroImage || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80"}
          alt={project?.title || "Project Image"}
          fill
          unoptimized
          priority
          className="object-cover object-center"
          sizes="(max-width: 1024px) 100vw, 66vw"
        />
      </div>

      {/* 2. Main Headline & Intro Paragraph */}
      <div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase text-[#001837] tracking-tight leading-tight mb-4">
          {project?.title}
        </h2>
        <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed font-normal">
          {project?.introParagraph}
        </p>
      </div>

      {/* 3. Section 2: Sub-headline & Paragraph */}
      {project?.section2Title && (
        <div className="pt-2">
          <h3 className="text-xl sm:text-2xl font-extrabold uppercase text-[#001837] tracking-tight mb-3">
            {project?.section2Title}
          </h3>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
            {project?.section2Paragraph}
          </p>
        </div>
      )}

      {/* 4. Section 3: PROJECT BENEFITS Grid */}
      <div className="pt-2">
        <h3 className="text-xl sm:text-2xl font-extrabold uppercase text-[#001837] tracking-tight mb-6">
          {project?.benefitsTitle || "PROJECT BENEFITS"}
        </h3>

        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 bg-[#f4f6f9] p-6 sm:p-8 rounded-3xl border border-slate-200/80">
          {/* Small Benefit Gallery Image */}
          {project?.benefitImage && (
            <div className="relative w-full sm:w-[240px] h-[190px] rounded-2xl overflow-hidden shadow-md flex-shrink-0 bg-slate-100">
              <Image
                src={project.benefitImage}
                alt="Project Benefit Visual"
                fill
                unoptimized
                className="object-cover object-center"
                sizes="(max-width: 640px) 100vw, 240px"
              />
            </div>
          )}

          {/* 6 Blue Checkmark Points */}
          <div className="space-y-3 w-full">
            {project?.benefitsPoints?.map((point, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#0055ff] to-[#00aaff] flex items-center justify-center flex-shrink-0 shadow-xs">
                  <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                </div>
                <span className="text-slate-700 text-xs sm:text-sm font-bold">
                  {point}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Section 4: Final Conclusion Sub-headline & Paragraph */}
      {project?.section4Title && (
        <div className="pt-2">
          <h3 className="text-xl sm:text-2xl font-extrabold uppercase text-[#001837] tracking-tight mb-3">
            {project?.section4Title}
          </h3>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
            {project?.section4Paragraph}
          </p>
        </div>
      )}
    </article>
  );
}
