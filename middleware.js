import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/resume(.*)",
  "/interview(.*)",
  "/ai-cover-letter(.*)",
  "/onboarding(.*)",
]);

const isPublicRoute = createRouteMatcher([
  "/",
  "/pricing(.*)",
  "/success(.*)",
  "/cancel(.*)",
  "/api/stripe-session(.*)", // to let Stripe fetch succeed
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // ✅ Let public routes pass
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // 🔐 Redirect to sign-in if protected and not logged in
  if (!userId && isProtectedRoute(req)) {
    const { redirectToSignIn } = await auth();
    return redirectToSignIn();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
