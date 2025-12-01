import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      userRole?: "user" | "admin" | "superadmin";
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    userRole?: "user" | "admin" | "superadmin";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    userRole?: "user" | "admin" | "superadmin";
  }
}
