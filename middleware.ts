export { default } from "next-auth/middleware"

export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*", "/staff/:path*", "/tickets/:path*"],
}

