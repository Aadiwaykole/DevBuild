import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";
import { syncGithubData } from "@/lib/syncGithubData";

export async function processNextSyncJob() {
  const job = await prisma.syncJob.findFirst({
    where: {
      status: "PENDING",
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      user: true,
    },
  });

  if (!job) {
    return false;
  }

  // Claim the job.
  // Only claim it if it is still PENDING.
  const claimed = await prisma.syncJob.updateMany({
    where: {
      id: job.id,
      status: "PENDING",
    },
    data: {
      status: "RUNNING",
      startedAt: new Date(),
      error: null,
    },
  });

  if (claimed.count === 0) {
    return false;
  }

  try {
    if (!job.user.githubAccessToken) {
      throw new Error("GitHub access token not found");
    }

    const accessToken = decrypt(job.user.githubAccessToken);

    console.log(`Starting sync job: ${job.id}`);

    const result = await syncGithubData(accessToken);

    await prisma.syncJob.update({
      where: {
        id: job.id,
      },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });

    console.log(`Sync job completed: ${job.id}`);

    console.log("Sync result:", result);

    return true;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    await prisma.syncJob.update({
      where: {
        id: job.id,
      },
      data: {
        status: "FAILED",
        completedAt: new Date(),
        error: errorMessage,
      },
    });

    console.error(`Sync job failed: ${job.id}`);
    console.error(errorMessage);

    return true;
  }
}