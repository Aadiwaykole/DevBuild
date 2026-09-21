import { prisma } from "@/lib/prisma";

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export async function syncGithubDependencies(
  accessToken: string,
  githubOwner: string,
  githubRepo: string,
  repositoryId: string
) {
  const response = await fetch(
    `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/package.json`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  if (!response.ok) {
    console.warn(
      `Skipping dependencies for ${githubRepo}: ${response.status}`
    );

    return 0;
  }

  const packageData = await response.json();

  if (!packageData.content) {
    return 0;
  }

  const packageJson: PackageJson = JSON.parse(
    Buffer.from(packageData.content, "base64").toString("utf-8")
  );

  await prisma.dependency.deleteMany({
    where: {
      repositoryId,
    },
  });

  let syncedCount = 0;

  for (const [name, version] of Object.entries(
    packageJson.dependencies || {}
  )) {
    await prisma.dependency.create({
      data: {
        name,
        version,
        type: "production",
        repositoryId,
      },
    });

    syncedCount++;
  }

  for (const [name, version] of Object.entries(
    packageJson.devDependencies || {}
  )) {
    await prisma.dependency.create({
      data: {
        name,
        version,
        type: "development",
        repositoryId,
      },
    });

    syncedCount++;
  }

  return syncedCount;
}