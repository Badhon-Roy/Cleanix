"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, Menu, X } from "lucide-react";

export function SwirlLogo() {
  return (
    <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#1877f2] flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className="w-6 h-6 text-white stroke-[2.2]"
      >
        <path
          d="M12 3a9 9 0 0 1 9 9c0 3.5-2 6.5-5 8m-4 1a9 9 0 0 1-9-9c0-3.5 2-6.5 5-8"
          strokeLinecap="round"
        />
        <path
          d="M12 7a5 5 0 0 1 5 5c0 1.9-1 3.5-2.5 4.3M12 17a5 5 0 0 1-5-5c0-1.9 1-3.5 2.5-4.3"
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
    </div>
  );
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full sticky top-3 md:top-5 z-50 px-4 max-w-7xl mx-auto transition-all duration-300">
      <nav className="w-full bg-[#0d274c]/85 backdrop-blur-xl border border-white/15 rounded-full px-5 py-3 md:px-7 md:py-3.5 flex items-center justify-between shadow-2xl shadow-black/50">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <SwirlLogo />
          <span className="text-white text-xl md:text-2xl font-bold tracking-tight group-hover:text-blue-300 transition-colors">
            Cleanix
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          <Link
            href="/"
            className="text-slate-100 hover:text-white text-[18px] font-medium transition-colors py-1"
          >
            Home
          </Link>

          <Link
            href="/about"
            className="text-slate-100 hover:text-white text-[18px] font-medium transition-colors py-1"
          >
            About Us
          </Link>

          <Link
            href="/#services"
            className="text-slate-100 hover:text-white text-[18px] font-medium transition-colors py-1"
          >
            Services
          </Link>

          <Link
            href="/#projects"
            className="text-slate-100 hover:text-white text-[18px] font-medium transition-colors py-1"
          >
            Projects
          </Link>

          <Link
            href="/#blog"
            className="text-slate-100 hover:text-white text-[18px] font-medium transition-colors py-1"
          >
            Blog
          </Link>

          <Link
            href="/#contact"
            className="text-slate-100 hover:text-white text-[18px] font-medium transition-colors py-1"
          >
            Contact
          </Link>
        </div>

        {/* CTA Get a Quote Button */}
        <div className="hidden sm:flex items-center">
          <Link
            href="/#quote"
            className="bg-[#007eff] hover:bg-[#0066ee] text-white font-semibold text-[14px] pl-5 pr-1.5 py-1.5 rounded-full flex items-center gap-3 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02]"
          >
            <span>Get a Quote</span>
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#007eff] shadow-sm">
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </div>
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-slate-200 hover:text-white p-1.5 rounded-lg focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 bg-[#0b2144]/95 backdrop-blur-xl border border-white/15 rounded-2xl p-5 shadow-2xl flex flex-col gap-4">
          <Link
            href="/"
            className="text-slate-100 hover:text-white font-medium py-2 border-b border-white/10"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-slate-100 hover:text-white font-medium py-2 border-b border-white/10"
            onClick={() => setMobileMenuOpen(false)}
          >
            About Us
          </Link>
          <Link
            href="/#services"
            className="text-slate-100 hover:text-white font-medium py-2 border-b border-white/10"
            onClick={() => setMobileMenuOpen(false)}
          >
            Services
          </Link>
          <Link
            href="/#projects"
            className="text-slate-100 hover:text-white font-medium py-2 border-b border-white/10"
            onClick={() => setMobileMenuOpen(false)}
          >
            Projects
          </Link>
          <Link
            href="/#blog"
            className="text-slate-100 hover:text-white font-medium py-2 border-b border-white/10"
            onClick={() => setMobileMenuOpen(false)}
          >
            Blog
          </Link>
          <Link
            href="/#contact"
            className="text-slate-100 hover:text-white font-medium py-2 border-b border-white/10"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </Link>
          <div className="pt-2">
            <Link
              href="/#quote"
              className="bg-[#007eff] hover:bg-[#0066ee] text-white font-semibold text-sm pl-5 pr-2 py-2.5 rounded-full flex items-center justify-between w-full shadow-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Get a Quote</span>
              <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#007eff]">
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </div>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
