import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { UserType } from "@/app/generated/prisma"; // Adjust if path is different

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    // This runs only if the user is authorized
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (!token) return false;

        const url = req.nextUrl.pathname;
        const userType = token.type;

        // Match path against user type
        if (
          url.startsWith("/api/user/student") &&
          userType !== UserType.Student
        )
          return false;

        if (url.startsWith("/api/user/admin") && userType !== UserType.Admin)
          return false;

        if (
          url.startsWith("/api/user/counselor") &&
          userType !== UserType.Counselor
        )
          return false;

        // Allow all authenticated users to access /user/*
        if (url.startsWith("/user") || url.startsWith("/api/user")) return true;

        return true; // Default allow
      },
    },
  }
);

export const config = {
  matcher: [
    "/user/:path*",
    "/api/user/:path*",
    "/api/user/student/:path*",
    "/api/user/admin/:path*",
    "/api/user/counselor/:path*",
  ],
};
