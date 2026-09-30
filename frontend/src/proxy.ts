import { clerkMiddleware } from "@clerk/nextjs/server";

const protectedRoutes = ["/dashboard", "/interviews", "/analytics", "/profile"];

export default clerkMiddleware(async (auth, request) => {
  const pathname = request.nextUrl.pathname;
  if (protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
