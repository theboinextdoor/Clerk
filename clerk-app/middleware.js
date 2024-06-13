import { clerkMiddleware } from "@clerk/nextjs/server";


export default clerkMiddleware({
     publicRoutes : ["/" ,"/register"]
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};