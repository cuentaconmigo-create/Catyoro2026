import { PrismaAdapter } from "@auth/prisma-adapter";
import { Role } from "@prisma/client";
import { getServerSession, NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER_HOST
        ? {
            host: process.env.EMAIL_SERVER_HOST,
            port: Number(process.env.EMAIL_SERVER_PORT ?? 1025),
            auth: process.env.EMAIL_SERVER_USER
              ? {
                  user: process.env.EMAIL_SERVER_USER,
                  pass: process.env.EMAIL_SERVER_PASSWORD
                }
              : undefined
          }
        : undefined,
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest(params) {
        if (!process.env.EMAIL_SERVER_HOST) {
          console.log("[MAGIC_LINK_DEV]", params.url);
          return;
        }
        const { sendVerificationRequest } = await import("next-auth/providers/email");
        return sendVerificationRequest(params);
      }
    })
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = (user as { role: Role }).role;
      }
      return session;
    }
  }
};

export async function auth() {
  return getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();
  if (session.user.role !== "ADMIN") throw new Error("Forbidden");
  return session;
}
