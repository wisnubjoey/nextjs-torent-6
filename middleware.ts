import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect dashboard routes
    if (pathname.startsWith("/dashboard")) {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session) {
            return NextResponse.redirect(new URL("/sign-in", request.url));
        }
    }

    // Protect admin routes
    if (pathname.startsWith("/admin")) {
        // Skip protection for login page (it's outside the admin route group)
        if (pathname.startsWith("/admin/login")) {
            // If already admin, redirect to dashboard
            const session = await auth.api.getSession({
                headers: await headers()
            });
            
            if (session && session.user.role === "admin") {
                return NextResponse.redirect(new URL("/admin/dashboard", request.url));
            }
            
            return NextResponse.next();
        }

        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session) {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }

        if (session.user.role !== "admin") {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};