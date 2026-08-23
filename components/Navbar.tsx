"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, Menu, X, ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import { logoutUser } from "@/services/authService";
import { getAuthUser } from "@/utils/cookie";

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

interface NavbarProps {
  user?: any;
}

export default function Navbar({ user: initialUser }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(initialUser);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setUser(initialUser || getAuthUser() || null);
  }, [initialUser, pathname]);

  // Click outside listener to automatically close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [userMenuOpen]);

  const handleLogout = () => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    logoutUser("/login");
  };

  const getDashboardHref = () => {
    if (!user) return "/dashboard";
    if (user.role === "ADMIN") return "/admin";
    if (user.role === "CLEANER") {
      if (user.status === "PENDING_APPROVAL" || user.isApproved === false) {
        return "/waiting-approval";
      }
      return "/cleaner";
    }
    return "/dashboard";
  };

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Projects", href: "/projects" },
    { name: "Pricing", href: "/pricing" },
    { name: "Coverage Area", href: "/coverage" },
    { name: "Contact", href: "/contact" },
  ];

  const checkIsActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/about") return pathname === "/about";
    if (href === "/services") return pathname.startsWith("/services");
    if (href === "/projects") return pathname.startsWith("/projects");
    if (href === "/pricing") return pathname.startsWith("/pricing");
    if (href === "/coverage") return pathname.startsWith("/coverage");
    if (href === "/contact") return pathname.startsWith("/contact");
    return false;
  };

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
        <div className="hidden lg:flex items-center gap-5 xl:gap-7">
          {navItems.map((item) => {
            const isActive = checkIsActive(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`text-[17px] transition-all duration-300 py-1 relative ${
                  isActive
                    ? "text-[#007eff]"
                    : "text-slate-100 hover:text-white font-medium"
                }`}
              >
                <span>{item.name}</span>
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-[#007eff] rounded-full shadow-[0_0_10px_#007eff]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* CTA Login Button or Logged In User Menu */}
        <div className="hidden sm:flex items-center">
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/25 px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer shadow-md hover:shadow-blue-500/20 active:scale-95"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md overflow-hidden flex-shrink-0 border-2 border-white/40">
                  {user.avatar || user.profile?.avatar ? (
                    <img
                      src={user.avatar || user.profile?.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user.name?.charAt(0)?.toUpperCase() || "U"
                  )}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-extrabold text-white max-w-[130px] truncate leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-blue-300 uppercase tracking-widest font-black leading-tight">
                    {user.role}
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-300 transition-transform duration-200 ${
                    userMenuOpen ? "rotate-180 text-white" : ""
                  }`}
                />
              </button>

              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-3 w-64 sm:w-72 bg-[#0a1e3b]/95 backdrop-blur-2xl border border-white/20 rounded-3xl p-3 shadow-2xl shadow-black/80 z-50 animate-in fade-in zoom-in-95 duration-200">
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-white/10 mb-2 bg-white/5 rounded-2xl">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-base font-extrabold text-white truncate leading-snug">
                        {user.name}
                      </p>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                        {user.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium truncate">
                      {user.email}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="space-y-1">
                    <Link
                      href={getDashboardHref()}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm sm:text-[15px] font-bold text-slate-100 hover:text-white hover:bg-blue-600/30 border border-transparent hover:border-blue-400/30 transition-all duration-150"
                    >
                      <div className="w-8.5 h-8.5 rounded-xl bg-blue-500/20 text-[#007eff] flex items-center justify-center flex-shrink-0">
                        <LayoutDashboard className="w-4.5 h-4.5" />
                      </div>
                      <span>Dashboard Portal</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm sm:text-[15px] font-bold text-red-400 hover:text-red-300 hover:bg-red-500/15 border border-transparent hover:border-red-500/30 transition-all duration-150 cursor-pointer"
                    >
                      <div className="w-8.5 h-8.5 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center flex-shrink-0">
                        <LogOut className="w-4.5 h-4.5" />
                      </div>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-[#007eff] hover:bg-[#0066ee] text-white font-semibold text-[14px] pl-5 pr-1.5 py-1.5 rounded-full flex items-center gap-3 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02]"
            >
              <span>Login</span>
              <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#007eff] shadow-sm">
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </div>
            </Link>
          )}
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
        <div className="lg:hidden mt-3 bg-[#0b2144]/95 backdrop-blur-xl border border-white/15 rounded-2xl p-5 shadow-2xl flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = checkIsActive(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-between ${
                  isActive
                    ? "bg-[#007eff]/20 text-[#007eff] font-extrabold border border-[#007eff]/40"
                    : "text-slate-100 hover:text-white font-medium hover:bg-white/5"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{item.name}</span>
                {isActive && (
                  <div className="w-2 h-2 rounded-full bg-[#007eff] shadow-[0_0_8px_#007eff]" />
                )}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-white/10 mt-1">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs overflow-hidden">
                    {user.avatar || user.profile?.avatar ? (
                      <img src={user.avatar || user.profile?.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name?.charAt(0)?.toUpperCase() || "U"
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">{user.name}</span>
                    <span className="text-xs text-blue-300 font-semibold uppercase">{user.role}</span>
                  </div>
                </div>
                <Link
                  href={getDashboardHref()}
                  className="bg-[#007eff] text-white font-semibold text-sm py-2.5 px-4 rounded-xl flex items-center justify-between w-full shadow-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Go to Dashboard</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-center py-2 text-xs font-semibold text-red-400 hover:text-red-300 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-[#007eff] hover:bg-[#0066ee] text-white font-semibold text-sm pl-5 pr-2 py-2.5 rounded-full flex items-center justify-between w-full shadow-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Login</span>
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#007eff]">
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </div>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
