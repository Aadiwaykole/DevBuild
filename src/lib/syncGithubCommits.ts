import { prisma } from "@/lib/prisma";
import {syncGithubDependencies} from "@/lib/syncGithubDependencies";

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      date: string;
    } | null;
  };
}

export async function syncGithubCommits(
  accessToken: string,
  githubOwner: string,
  githubRepo: string,
  repositoryId: string
) {
  const response = await fetch(
    `https://api.github.com/repos/${githubOwner}/${githubRepo}/commits?per_page=100`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    console.warn(
      `Skipping commits for ${githubRepo}: ${response.status} ${
        errorData?.message || "Unknown GitHub API error"
      }`
    );

    return 0;
  }

  const githubCommits: GitHubCommit[] = await response.json();

  let syncedCount = 0;

  for (const commit of githubCommits) {
    if (!commit.commit.author?.date) {
      continue;
    }

    await prisma.commit.upsert({
      where: {
        githubId: commit.sha,
      },
      update: {
        message: commit.commit.message,
        committedAt: new Date(commit.commit.author.date),
        repositoryId,
      },
      create: {
        githubId: commit.sha,
        message: commit.commit.message,
        committedAt: new Date(commit.commit.author.date),
        repositoryId,
      },
    });

    syncedCount++;
  }

  return syncedCount;
}