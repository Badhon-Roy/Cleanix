"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { MapPin, Headphones, Clock, Send, Sparkles, CheckCircle2 } from "lucide-react";

import { createContactAPI } from "@/services/contactService";
import { toast } from "sonner";
import {
  defaultContactCMSData,
  ContactCMSContent,
} from "@/lib/contactCMSData";
import { io } from "socket.io-client";

interface ContactFormInputs {
  name: string;
  number: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactSectionProps {
  initialData?: ContactCMSContent;
}

export default function ContactSection({ initialData }: ContactSectionProps) {
  const [submitted, setSubmitted] = useState(false);
  const [cmsData, setCmsData] = useState<ContactCMSContent>(
    initialData || defaultContactCMSData
  );

  useEffect(() => {
    if (initialData) {
      setCmsData(initialData);
    }

    const socketUrl =
      process.env.NEXT_PUBLIC_BASE_URL?.replace("/api/v1", "") ||
      "http://localhost:5000";
    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socket.on("cms_updated", (payload: any) => {
      if (payload?.page === "contact" || payload?.data) {
        const delta = payload?.updatedFields || payload?.data;
        if (delta) {
          setCmsData((prev) => ({ ...prev, ...delta }));
        }
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [initialData]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInputs>();

  const onSubmit: SubmitHandler<ContactFormInputs> = async (data) => {
    try {
      const res = await createContactAPI({
        name: data.name,
        phone: data.number,
        email: data.email,
        subject: data.subject,
        message: data.message,
      });

      if (res && res.success) {
        toast.success("Inquiry Submitted! Cleanix HQ will call/email you back shortly.", {
          description: `Name: ${data.name} | Phone: ${data.number}`,
        });

        setSubmitted(true);
        reset();

        setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      } else {
        toast.error(res?.message || "Failed to submit inquiry. Please try again.");
      }
    } catch (err: any) {
      console.error("Error submitting contact form:", err);
      toast.error("Failed to submit inquiry. Please try again.");
    }
  };

  return (
    <section className="w-full bg-white text-[#001837] py-16 md:py-24 px-4 sm:px-6 lg:px-12 border-b border-slate-100 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Top Section: Left Custom Cleaner Image + Right Form Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Transparent Cleaner Image with Native Top Notched Corners */}
          <div className="lg:col-span-6 relative w-full h-[460px] sm:h-[540px] md:h-[580px] flex items-center justify-center group">
            <Image
              src={
                cmsData?.formCleanerImage ||
                "https://framerusercontent.com/images/sooGLoQVstKUc2PnwKtqQNMI.png?width=588&height=630"
              }
              alt="Ready to Ship Smarter Contact Our Team"
              fill
              unoptimized
              priority
              className="object-contain object-center lg:object-left group-hover:scale-105 transition-transform duration-700 drop-shadow-2xl"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Right Column: Dark Form Box */}
          <div className="lg:col-span-6 bg-[#0b2144] rounded-3xl p-8 sm:p-10 border border-slate-200/40 shadow-2xl relative overflow-hidden text-white">
            {/* Background Glow */}
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#007eff]/20 rounded-full blur-[60px] pointer-events-none" />

            <div className="relative z-10">
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 border border-[#007eff]/50 text-[#007eff] font-bold text-xs tracking-wider uppercase rounded-full px-5 py-1.5 mb-6 bg-blue-50/10 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-[#007eff]" />
                <span>{cmsData?.formBadge || "CONTACT REQUEST"}</span>
              </div>

              {/* Main Headline */}
              <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight leading-[1.12] mb-8">
                {cmsData?.formTitleLine1}
                {cmsData?.formTitleLine2}{" "}
                {cmsData?.formTitleHighlight && (
                  <span className="text-[#007eff]">{cmsData?.formTitleHighlight}</span>
                )}{" "}
                {cmsData?.formTitleLine3}
              </h2>

              {submitted ? (
                <div className="bg-[#007eff]/20 border border-[#007eff] rounded-2xl p-6 text-center space-y-3 py-10 animate-fade-in">
                  <CheckCircle2 className="w-12 h-12 text-[#007eff] mx-auto" />
                  <h3 className="text-xl font-extrabold text-white">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-slate-300 text-sm">
                    Thank you for reaching out. Our cleaning coordinator will call you within 15 minutes.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                  {/* Name & Phone Inputs Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-slate-300 font-extrabold text-xs uppercase tracking-wider mb-2">
                        NAME
                      </label>
                      <input
                        type="text"
                        placeholder="Jane Smith"
                        {...register("name", { required: "Name is required" })}
                        className={`w-full bg-[#1a335a]/80 border text-white placeholder:text-slate-400 font-medium text-sm rounded-xl px-4 py-3.5 focus:outline-none transition-colors ${
                          errors.name
                            ? "border-red-500 focus:border-red-500"
                            : "border-white/15 focus:border-[#007eff]"
                        }`}
                      />
                      {errors.name && (
                        <span className="text-red-400 text-xs font-semibold mt-1 block">
                          {errors.name.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-slate-300 font-extrabold text-xs uppercase tracking-wider mb-2">
                        NUMBER
                      </label>
                      <input
                        type="tel"
                        placeholder="Phone No."
                        {...register("number", {
                          required: "Phone number is required",
                          pattern: {
                            value: /^[0-9+\s-]{8,}$/,
                            message: "Enter a valid phone number",
                          },
                        })}
                        className={`w-full bg-[#1a335a]/80 border text-white placeholder:text-slate-400 font-medium text-sm rounded-xl px-4 py-3.5 focus:outline-none transition-colors ${
                          errors.number
                            ? "border-red-500 focus:border-red-500"
                            : "border-white/15 focus:border-[#007eff]"
                        }`}
                      />
                      {errors.number && (
                        <span className="text-red-400 text-xs font-semibold mt-1 block">
                          {errors.number.message}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-slate-300 font-extrabold text-xs uppercase tracking-wider mb-2">
                      EMAIL
                    </label>
                    <input
                      type="email"
                      placeholder="jane@framer.com"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^\S+@\S+\.\S+$/i,
                          message: "Enter a valid email address",
                        },
                      })}
                      className={`w-full bg-[#1a335a]/80 border text-white placeholder:text-slate-400 font-medium text-sm rounded-xl px-4 py-3.5 focus:outline-none transition-colors ${
                        errors.email
                          ? "border-red-500 focus:border-red-500"
                          : "border-white/15 focus:border-[#007eff]"
                      }`}
                    />
                    {errors.email && (
                      <span className="text-red-400 text-xs font-semibold mt-1 block">
                        {errors.email.message}
                      </span>
                    )}
                  </div>

                  {/* Subject Input */}
                  <div>
                    <label className="block text-slate-300 font-extrabold text-xs uppercase tracking-wider mb-2">
                      SUBJECT
                    </label>
                    <input
                      type="text"
                      placeholder="Inquiry Subject (e.g. Deep Home Cleaning)"
                      {...register("subject", {
                        required: "Subject is required",
                        minLength: {
                          value: 3,
                          message: "Subject must be at least 3 characters",
                        },
                      })}
                      className={`w-full bg-[#1a335a]/80 border text-white placeholder:text-slate-400 font-medium text-sm rounded-xl px-4 py-3.5 focus:outline-none transition-colors ${
                        errors.subject
                          ? "border-red-500 focus:border-red-500"
                          : "border-white/15 focus:border-[#007eff]"
                      }`}
                    />
                    {errors.subject && (
                      <span className="text-red-400 text-xs font-semibold mt-1 block">
                        {errors.subject.message}
                      </span>
                    )}
                  </div>

                  {/* Message Textarea */}
                  <div>
                    <label className="block text-slate-300 font-extrabold text-xs uppercase tracking-wider mb-2">
                      WRITE MESSAGE...
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Write Message..."
                      {...register("message", {
                        required: "Message is required",
                        minLength: {
                          value: 10,
                          message: "Message must be at least 10 characters",
                        },
                      })}
                      className={`w-full bg-[#1a335a]/80 border text-white placeholder:text-slate-400 font-medium text-sm rounded-xl px-4 py-3.5 focus:outline-none transition-colors resize-none ${
                        errors.message
                          ? "border-red-500 focus:border-red-500"
                          : "border-white/15 focus:border-[#007eff]"
                      }`}
                    />
                    {errors.message && (
                      <span className="text-red-400 text-xs font-semibold mt-1 block">
                        {errors.message.message}
                      </span>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#007eff] hover:bg-[#0066ee] text-white font-extrabold text-sm uppercase tracking-wider py-4 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_0_25px_rgba(0,126,255,0.4)] hover:shadow-[0_0_35px_rgba(0,126,255,0.7)] hover:scale-[1.01] disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bottom 3 Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14 sm:mt-16">
          {/* Card 1: Location */}
          <div className="bg-[#0b2144] text-white rounded-3xl p-6 sm:p-7 border border-slate-200/40 shadow-xl flex items-start gap-4 hover:border-[#007eff]/50 transition-all duration-300 group">
            <div className="w-11 h-11 rounded-full bg-[#007eff] text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <MapPin className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white mb-1.5">
                {cmsData?.locationTitle || "Location"}
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-line">
                {cmsData?.locationText}
              </p>
            </div>
          </div>

          {/* Card 2: Support Clients */}
          <div className="bg-[#0b2144] text-white rounded-3xl p-6 sm:p-7 border border-slate-200/40 shadow-xl flex items-start gap-4 hover:border-[#007eff]/50 transition-all duration-300 group">
            <div className="w-11 h-11 rounded-full bg-[#007eff] text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <Headphones className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white mb-1.5">
                {cmsData?.supportTitle || "Support Clients"}
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-line">
                {cmsData?.supportText}
              </p>
            </div>
          </div>

          {/* Card 3: Opening Hours */}
          <div className="bg-[#0b2144] text-white rounded-3xl p-6 sm:p-7 border border-slate-200/40 shadow-xl flex items-start gap-4 hover:border-[#007eff]/50 transition-all duration-300 group">
            <div className="w-11 h-11 rounded-full bg-[#007eff] text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white mb-1.5">
                {cmsData?.hoursTitle || "Opening Hours"}
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-line">
                {cmsData?.hoursText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
