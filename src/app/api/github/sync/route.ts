import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { syncGithubData } from "@/lib/syncGithubData";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const githubResponse = await fetch(
      "https://api.github.com/user",
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

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
        {
          error:
            "User not found. Please sync GitHub data first.",
        },
        { status: 404 }
      );
    }

    const syncJob = await prisma.syncJob.create({
      data: {
        status: "RUNNING",
        startedAt: new Date(),
        userId: user.id,
      },
    });

    try {
      const result = await syncGithubData(
        session.accessToken
      );

      await prisma.syncJob.update({
        where: {
          id: syncJob.id,
        },
        data: {
          status: "COMPLETED",
          completedAt: new Date(),
        },
      });

      return Response.json({
        success: true,
        message: "GitHub data synchronized successfully",
        jobId: syncJob.id,
        data: result,
      });
    } catch (error) {
      await prisma.syncJob.update({
        where: {
          id: syncJob.id,
        },
        data: {
          status: "FAILED",
          completedAt: new Date(),
          error:
            error instanceof Error
              ? error.message
              : "Unknown synchronization error",
        },
      });

      throw error;
    }
  } catch (error) {
    console.error("GITHUB SYNC ERROR:", error);

    return Response.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to synchronize GitHub data",
      },
      { status: 500 }
    );
  }
}