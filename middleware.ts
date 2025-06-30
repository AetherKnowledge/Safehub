import middleware from "next-auth/middleware";

export default middleware;

export const config = {
  matcher: ["/user/:path*", "/api/user/:path*"],
};
