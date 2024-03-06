import { DefaultSession, DefaultUser, Session } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultUser["user"] & {
      id: number;
      username: string;
      role: string;
    };
  }

  interface User extends DefaultUser {
    id: number;
    username: string;
    role: string;
  }
}
