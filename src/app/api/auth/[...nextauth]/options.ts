import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import dbConnect from "@/lib/db/connect";
import UserModel from "@/lib/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          username:
            profile.name?.replace(/\s+/g, "").toLowerCase() ||
            profile.email.split("@")[0],
        };
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email || `${profile.id}@github.com`,
          image: profile.avatar_url,
          username: profile.login || profile.email?.split("@")[0],
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      await dbConnect();

      try {
        const existingUser = await UserModel.findOne({ email: user.email });

        if (!existingUser) {
          await UserModel.create({
            username: user.name || user.username,
            email: user.email,
            image: user.image || "",
            authProvider: account?.provider,
            providerId: account?.providerAccountId,
          });
        }

        return true;
      } catch (error) {
        console.error("SignIn Error:", error);
        throw new Error("Error during sign-in process.");
      }
    },
    async jwt({ token, user }) {
      await dbConnect();
      if (user) {
        const dbUser = await UserModel.findOne({ email: user.email });
        if (dbUser) {
          token._id = dbUser._id.toString();
          token.username = dbUser.username;
          token.email = dbUser.email;
          token.image = dbUser.image;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.username = token.username;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in",
    error: "/auth/error",
  },
};
