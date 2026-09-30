import NextAuth, { type NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/encryption";

type GitHubProfile = {
  id: number;
  login: string;
  email?: string | null;
};

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.access_token && profile) {
        const githubProfile = profile as GitHubProfile;

        const githubAccessToken = encrypt(account.access_token);

        await prisma.user.upsert({
          where: {
            githubId: String(githubProfile.id),
          },

          update: {
            githubAccessToken,
            username: githubProfile.login,
            email: githubProfile.email ?? null,
          },

          create: {
            githubId: String(githubProfile.id),
            username: githubProfile.login,
            email: githubProfile.email ?? null,
            githubAccessToken,
          },
        });

        token.accessToken = account.access_token;
      }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
};