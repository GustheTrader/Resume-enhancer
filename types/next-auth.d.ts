
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      companyName?: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    companyName?: string | null;
  }

  interface JWT {
    id: string;
    firstName?: string;
    lastName?: string;
    companyName?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    firstName?: string;
    lastName?: string;
    companyName?: string;
  }
}
