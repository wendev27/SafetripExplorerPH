import NextAuth, { AuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import connectDB from "@/lib/db";
import UserModel from "@/services/models/User";

/**
 * Type augmentation (safe):
 * - Keep NextAuth built-ins (role: string | undefined) intact
 * - Add a strict userRole property for our app-level RBAC checks
 */
declare module "next-auth" {
  interface User {
    userRole?: "user" | "admin" | "superadmin"; // our strict enum
  }

  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      userRole?: "user" | "admin" | "superadmin";
    };
  }

  interface JWT {
    id?: string;
    role?: string;
    userRole?: "user" | "admin" | "superadmin";
  }
}

/**
 * Auth options for NextAuth
 */
export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      // authorize() should return an object compatible with NextAuth User or null
      async authorize(credentials) {
        // ensure DB is connected
        await connectDB();

        const { email, password } = (credentials || {}) as {
          email?: string;
          password?: string;
        };

        if (!email || !password) {
          throw new Error("Missing email or password");
        }

        // find user in MongoDB (lean -> plain object)
        const user = await UserModel.findOne({ email }).lean();
        if (!user) {
          // NextAuth will surface this as an error and redirect to /api/auth/error
          throw new Error("User not found");
        }

        // compare hashed password
        const isValid = await compare(password, user.password);
        if (!isValid) {
          throw new Error("Wrong password");
        }

        // return a plain object; include both the generic role (string) and strict userRole
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          // keep built-in (string) - useful for compatibility
          role: user.role as string,
          // app-level strict enum for RBAC checks (userRole)
          userRole: (user.role as "user" | "admin" | "superadmin") ?? "user",
        };
      },
    }),
  ],

  // callbacks to transfer properties into JWT & Session
  callbacks: {
    // token: JWT, user: returned user from authorize() | AdapterUser
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        // user may include id, role, userRole
        if (user.id) token.id = user.id;
        if (user.role) token.role = user.role;
        if (user.userRole) token.userRole = user.userRole;
      }
      return token;
    },

    // session receives token -> attach id & userRole to session.user
    async session({ session, token }: { session: any; token: any }) {
      // ensure session.user exists (DefaultSession shape)
      if (token) {
        session.user = session.user || {};
        session.user.id = token.id ?? session.user.id ?? "";
        // keep the generic role (string) for compatibility
        if (token.role) session.user.role = token.role;
        // attach our strict role to session.user.userRole
        if (token.userRole) session.user.userRole = token.userRole;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },

  // use a real secret in production
  secret: process.env.NEXTAUTH_SECRET,
};

// Export GET + POST for App Router route file
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
