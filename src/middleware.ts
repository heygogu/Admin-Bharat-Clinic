import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)","/"]);

export default clerkMiddleware(async (auth, req) => {

  const {sessionClaims} = await auth()
  console.log(sessionClaims,"sessionClaims");
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/"],
};