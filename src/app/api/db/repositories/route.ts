import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const githubResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      Accept: "application/vnd.github+json",
    },
  });

  if (!githubResponse.ok) {
    return Response.json(
      { error: "Failed to fetch GitHub user" },
      { status: 401 }
    );
  }

  const githubUser = await githubResponse.json();

  const user = await prisma.user.findUnique({
    where: {
      githubId: String(githubUser.id),
    },
  });

  if (!user) {
    return Response.json(
      { error: "User not found in database. Please sync GitHub data first." },
      { status: 404 }
    );
  }

  const repositories = await prisma.repository.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return Response.json({
    repositories,
  });
}