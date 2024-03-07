// export { default } from "next-auth/middleware";
import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { notFound } from "next/navigation";

export default withAuth(
  async function middleware(req: NextRequestWithAuth) {
    const pathname = req.nextUrl.pathname;
    const token = await getToken({ req });

    // if (!token) NextResponse.redirect(new URL("/login", req.url));

    if (pathname.startsWith("/admin") && token && token.role !== "admin") {
      return NextResponse.redirect(new URL("/not-found", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/",
    "/shop/:path*",
    "/wishlist/:path*",
    "/checkout/:path*",
    "/admin/:path*",
  ],
};
