import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      _id?: string;
      username: string;
      email: string;
      image?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    _id?: string;
    username: string;
    email: string;
    image?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    _id?: string;
    username: string;
    email: string;
    image?: string;
  }
}

