import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/login",
  },
});

export const config = {
  matcher: [
    "/dashboard",
    "/profile",
    "/profile/update",
    "/profile/change-password",
  ],
};
