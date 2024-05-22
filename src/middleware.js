import { NextRequest, NextResponse } from "next/server";

export async function middleware(req) {
  const url = req.nextUrl.clone();
  const code = url.searchParams.get("code");
  const accessToken = req.cookies.get("access_token");

  // Handle the /auth/callback route
  if (url.pathname === "/auth/callback" && code) {
    return NextResponse.redirect(
      new URL(`/api/auth/callback?code=${code}`, req.url)
    );
  }

  // Check if the user is logged in and trying to access /home
  if (url.pathname === "/home") {
    if (!accessToken) {
      // User is not authenticated, redirect to /
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Restrict access to certain routes if the user is not authenticated
  if (!accessToken && ["/home"].includes(url.pathname)) {
    // User is not authenticated, redirect to /
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Set a cookie to track viewed welcome message or handle other middleware tasks
  const response = NextResponse.next();
  return response;
}

export const config = {
  matcher: ["/auth/callback", "/", "/about", "/home"],
};
