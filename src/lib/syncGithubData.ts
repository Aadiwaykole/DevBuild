import { prisma } from "@/lib/prisma";

interface GitHubUser {
  id: number;
  login: string;
  email: string | null;
}

interface GitHubRepository {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
}

export async function syncGithubData(accessToken: string) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Accept: "application/vnd.github+json",
  };

  const userResponse = await fetch("https://api.github.com/user", {
    headers,
  });

  if (!userResponse.ok) {
    throw new Error("Failed to fetch GitHub user");
  }

  const githubUser: GitHubUser = await userResponse.json();

  const user = await prisma.user.upsert({
    where: {
      githubId: String(githubUser.id),
    },
    update: {
      username: githubUser.login,
      email: githubUser.email,
    },
    create: {
      githubId: String(githubUser.id),
      username: githubUser.login,
      email: githubUser.email,
    },
  });

  const repositoriesResponse = await fetch(
    "https://api.github.com/user/repos?sort=updated&per_page=100",
    {
      headers,
    }
  );

  if (!repositoriesResponse.ok) {
    throw new Error("Failed to fetch GitHub repositories");
  }

  const githubRepositories: GitHubRepository[] =
    await repositoriesResponse.json();

  for (const repo of githubRepositories) {
    await prisma.repository.upsert({
      where: {
        githubId: repo.id,
      },
      update: {
        name: repo.name,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        userId: user.id,
      },
      create: {
        githubId: repo.id,
        name: repo.name,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        userId: user.id,
      },
    });
  }

  return {
    userId: user.id,
    username: user.username,
    repositoriesSynced: githubRepositories.length,
  };
}