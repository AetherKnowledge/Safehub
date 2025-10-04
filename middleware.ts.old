import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Check if user is authenticated
  if (!token) {
    // Redirect to login page
    return NextResponse.redirect(new URL("/api/auth/signin", request.url));
  }

  // Allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: ["/user/:path*", "/api/socket/:path*"],
};
