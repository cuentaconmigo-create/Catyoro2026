export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/projects/:path*", "/cycles/:path*", "/ranking/:path*", "/time-plan/:path*", "/admin/:path*", "/api/:path*"]
};
