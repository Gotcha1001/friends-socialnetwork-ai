import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const authData = await auth();
  console.log("Middleware: Request URL", req.url);
  console.log("Middleware: Auth data", {
    userId: authData.userId,
    sessionId: authData.sessionId,
  });
  if (!isPublicRoute(req)) {
    console.log("Middleware: Protecting route, calling auth.protect()");
    try {
      await auth.protect();
    } catch (error) {
      console.error("Middleware: auth.protect failed", error);
      throw error;
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// // Define public routes that don't require authentication
// const isPublicRoute = createRouteMatcher([
//   '/',
//   '/sign-in(.*)',
//   '/sign-up(.*)',
// ]);

// export default clerkMiddleware((auth, req) => {
//   const { userId } = auth();
//   console.log('Middleware: URL:', req.url, 'Authenticated:', !!userId);

//   // If the route is not public and the user is not authenticated, redirect to sign-in
//   if (!isPublicRoute(req) && !userId) {
//     const signInUrl = new URL('/sign-in', req.url);
//     signInUrl.searchParams.set('redirect_url', req.url);
//     return NextResponse.redirect(signInUrl);
//   }

//   return NextResponse.next();
// });

// export const config = {
//   matcher: [
//     // Skip Next.js internals and static files
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// };
