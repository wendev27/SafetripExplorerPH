import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/db";
import { compare } from "bcryptjs";
import { User } from "next-auth";

export default NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const usersCollection = client.db().collection("users");

        const user = await usersCollection.findOne({
          email: credentials?.email,
        });
        if (!user) {
          throw new Error("No user found with this email");
        }

        const isValid = await compare(credentials!.password, user.password);
        if (!isValid) {
          throw new Error("Password is incorrect");
        }

        // Return minimal user object
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        } as User;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        // session.user = { ...session.user, id: token.id, role: token.role };
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
