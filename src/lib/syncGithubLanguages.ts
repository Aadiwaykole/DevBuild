import { prisma } from "@/lib/prisma";

interface GitHubLanguages {
  [language: string]: number;
}

export async function syncGithubLanguages(
  accessToken: string,
  githubOwner: string,
  githubRepo: string,
  repositoryId: string
) {
  const response = await fetch(
    `https://api.github.com/repos/${githubOwner}/${githubRepo}/languages`,
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
      `Skipping languages for ${githubRepo}: ${response.status} ${
        errorData?.message || "Unknown GitHub API error"
      }`
    );

    return 0;
  }

  const languages: GitHubLanguages = await response.json();

  await prisma.repositoryLanguage.deleteMany({
    where: {
      repositoryId,
    },
  });

  let syncedCount = 0;

  for (const [language, bytes] of Object.entries(languages)) {
    await prisma.repositoryLanguage.create({
      data: {
        language,
        bytes,
        repositoryId,
      },
    });

    syncedCount++;
  }

  return syncedCount;
}