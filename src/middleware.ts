import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	const token = request.cookies.get("accessToken")?.value;
	const { pathname } = request.nextUrl;

	// Public routes that don't require authentication
	const publicRoutes = [
		"/auth/login",
		"/auth/register",
		"/auth/forgot-password",
	];
	const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

	// Admin routes
	const isAdminRoute = pathname.startsWith("/admin");

	// If accessing a protected route without token, redirect to login
	if (!token && !isPublicRoute) {
		return NextResponse.redirect(new URL("/auth/login", request.url));
	}

	// If accessing admin routes, check if user is admin
	if (isAdminRoute && token) {
		try {
			const userCookie = request.cookies.get("user")?.value;
			if (userCookie) {
				const user = JSON.parse(userCookie);
				if (user.role !== "ADMIN") {
					return NextResponse.redirect(new URL("/dashboard", request.url));
				}
			}
		} catch (error) {
			return NextResponse.redirect(new URL("/auth/login", request.url));
		}
	}

	// If accessing auth routes while logged in, redirect to dashboard
	if (token && isPublicRoute) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
