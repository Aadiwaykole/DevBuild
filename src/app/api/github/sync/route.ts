import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    // Verify the GitHub account
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

    // Find our user in PostgreSQL
    const user = await prisma.user.findUnique({
      where: {
        githubId: String(githubUser.id),
      },
    });

    if (!user) {
      return Response.json(
        {
          error:
            "User not found. Please sign in with GitHub again.",
        },
        { status: 404 }
      );
    }

    // Create a job instead of doing the heavy sync here
    const syncJob = await prisma.syncJob.create({
      data: {
        status: "PENDING",
        userId: user.id,
      },
    });

    return Response.json({
      success: true,
      message: "GitHub synchronization queued",
      jobId: syncJob.id,
    });
  } catch (error) {
    console.error("SYNC QUEUE ERROR:", error);

    return Response.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to queue synchronization",
      },
      { status: 500 }
    );
  }
}