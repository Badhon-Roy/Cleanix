import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Role-to-Dashboard mapping helper
const ROLE_DEFAULT_DASHBOARDS: Record<string, string> = {
  ADMIN: "/admin",
  CLEANER: "/cleaner",
  TEAM_LEADER: "/team",
  CUSTOMER: "/dashboard",
};

/**
 * Decodes JWT payload in Edge runtime without external libraries
 */
function getRoleAndApprovalFromJwt(token: string): { role: string | null; isApproved?: boolean } {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return { role: null };
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const parsed = JSON.parse(jsonPayload);

    // Check token expiration if exp claim is present
    if (parsed.exp && Date.now() >= parsed.exp * 1000) {
      return { role: null };
    }

    return {
      role: parsed.role || null,
      isApproved: parsed.isApproved,
    };
  } catch {
    return { role: null };
  }
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 1. Get Auth Token from cookies
  const token =
    request.cookies.get("cleanix_token")?.value ||
    request.cookies.get("accessToken")?.value ||
    request.cookies.get("token")?.value;

  // 2. Decode user role and approval state
  const jwtInfo = token ? getRoleAndApprovalFromJwt(token) : { role: null };
  const roleFromCookie = request.cookies.get("cleanix_role")?.value;

  let userRole: string | null = jwtInfo.role || roleFromCookie || null;
  let isApproved: boolean | undefined = jwtInfo.isApproved;

  // Fallback to cleanix_user cookie if available
  const userCookieData = request.cookies.get("cleanix_user")?.value;
  if (userCookieData) {
    try {
      const parsedUser = JSON.parse(userCookieData);
      if (!userRole && parsedUser.role) {
        userRole = parsedUser.role;
      }
      if (isApproved === undefined && parsedUser.isApproved !== undefined) {
        isApproved = parsedUser.isApproved;
      }
    } catch {}
  }

  const isAuthenticated = Boolean(token && userRole);

  // Define route classifications
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isCleanerRoute = pathname === "/cleaner" || pathname.startsWith("/cleaner/");
  const isTeamRoute = pathname === "/team" || pathname.startsWith("/team/");
  const isCustomerDashboardRoute = pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  const isProtectedRoute = isAdminRoute || isCleanerRoute || isTeamRoute || isCustomerDashboardRoute;

  // 3. CASE A: Unauthenticated user trying to access protected dashboard routes
  if (!isAuthenticated && isProtectedRoute) {
    const fullRequestedPath = `${pathname}${search}`;
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", fullRequestedPath);
    return NextResponse.redirect(loginUrl);
  }

  // 4. CASE B: Authenticated user trying to access Auth routes (/login, /register)
  if (isAuthenticated && isAuthRoute) {
    let defaultDashboard = ROLE_DEFAULT_DASHBOARDS[userRole!] || "/dashboard";
    if (userRole === "CLEANER" && isApproved === false) {
      defaultDashboard = "/waiting-approval";
    }

    // Check if there is a valid redirect query param
    const redirectParam = request.nextUrl.searchParams.get("redirect");
    if (redirectParam && redirectParam.startsWith("/")) {
      return NextResponse.redirect(new URL(redirectParam, request.url));
    }

    return NextResponse.redirect(new URL(defaultDashboard, request.url));
  }

  // 5. CASE C: Authenticated user accessing Role-Restricted Routes (RBAC)
  if (isAuthenticated && isProtectedRoute) {
    // If Cleaner is pending approval, redirect to waiting-approval page
    if (userRole === "CLEANER" && isApproved === false && !pathname.startsWith("/waiting-approval")) {
      return NextResponse.redirect(new URL("/waiting-approval", request.url));
    }

    // Admin routes restriction
    if (isAdminRoute && userRole !== "ADMIN") {
      const allowedDashboard = ROLE_DEFAULT_DASHBOARDS[userRole!] || "/dashboard";
      return NextResponse.redirect(new URL(allowedDashboard, request.url));
    }

    // Cleaner routes restriction
    if (isCleanerRoute && userRole !== "CLEANER") {
      const allowedDashboard = ROLE_DEFAULT_DASHBOARDS[userRole!] || "/dashboard";
      return NextResponse.redirect(new URL(allowedDashboard, request.url));
    }

    // Team Leader routes restriction
    if (isTeamRoute && userRole !== "TEAM_LEADER") {
      const allowedDashboard = ROLE_DEFAULT_DASHBOARDS[userRole!] || "/dashboard";
      return NextResponse.redirect(new URL(allowedDashboard, request.url));
    }

    // Customer dashboard route restriction
    if (isCustomerDashboardRoute && userRole !== "CUSTOMER") {
      const allowedDashboard = ROLE_DEFAULT_DASHBOARDS[userRole!] || "/dashboard";
      return NextResponse.redirect(new URL(allowedDashboard, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/cleaner/:path*",
    "/team/:path*",
    "/login",
    "/register",
  ],
};
