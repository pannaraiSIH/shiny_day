import { prisma } from "@/lib/prisma";
import NextAuth, { AuthOptions, NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password) return null;

        const user = await prisma.users.findFirst({
          where: { username: credentials.username },
        });

        if (!user) {
          throw new Error(
            JSON.stringify({
              error: "Username is invalid",
            })
          );
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = bcrypt.hashSync(credentials.password, salt);
        const isPasswordCorrect = bcrypt.compareSync(
          hashedPassword,
          user?.password || ""
        );

        if (isPasswordCorrect) {
          throw new Error(
            JSON.stringify({
              error: "Password is invalid",
            })
          );
        }

        return {
          id: user?.id,
          name: user?.username,
          role: user?.role,
        } as User;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
  jwt: {
    maxAge: 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};
