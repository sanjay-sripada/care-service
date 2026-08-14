import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "saathicare_session";

const protectedRoutes: Record<string, string[]> = {
  customer: ["/home", "/history", "/family", "/profile", "/notifications", "/booking/active"],
  caregiver: ["/caregiver/dashboard", "/caregiver/jobs", "/caregiver/availability", "/caregiver/earnings", "/caregiver/reviews", "/caregiver/profile"],
  admin: ["/admin"],
};

async function getRole(request: NextRequest): Promise<string | null> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const secret = process.env.AUTH_SECRET;
    if (!secret) return null;
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return (payload as { role?: string }).role || null;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = await getRole(request);

  if (pathname.startsWith("/admin")) {
    if (!role) {
      return NextResponse.redirect(new URL("/login?redirect=/admin/dashboard", request.url));
    }
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  if (pathname.startsWith("/caregiver/dashboard") || pathname.startsWith("/caregiver/jobs")) {
    if (!role) {
      return NextResponse.redirect(new URL("/caregiver/login", request.url));
    }
    if (role !== "caregiver" && role !== "admin") {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  for (const route of protectedRoutes.customer) {
    if (pathname.startsWith(route)) {
      if (!role) {
        return NextResponse.redirect(new URL(`/login?redirect=${pathname}`, request.url));
      }
    }
  }

  if (pathname.startsWith("/booking/payment") && !role) {
    return NextResponse.redirect(new URL(`/login?redirect=${pathname}${request.nextUrl.search}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/home/:path*",
    "/history/:path*",
    "/family/:path*",
    "/profile/:path*",
    "/notifications/:path*",
    "/booking/active/:path*",
    "/booking/payment/:path*",
    "/caregiver/dashboard/:path*",
    "/caregiver/jobs/:path*",
    "/admin/:path*",
  ],
};
