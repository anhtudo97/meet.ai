import { db } from "@/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import * as schema from "@/db/schema";

let authInstance: ReturnType<typeof betterAuth> | null = null;

export const getAuth = async () => {
  if (authInstance) return authInstance;

  authInstance = betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg", // or "sqlite" or "mysql"
      schema: {
        ...schema,
      }
    }),
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
    emailAndPassword: {
      enabled: true,
    },
    plugins: [nextCookies()],
    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID as string,
        clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      },
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      },
    },
  });

  return authInstance;
};

export const auth = await getAuth();