import { prisma } from "@/lib/prisma";
import { syncGithubCommits } from "@/lib/syncGithubCommits";
import { syncGithubLanguages } from "@/lib/syncGithubLanguages";
import { syncGithubDependencies } from "@/lib/syncGithubDependencies";

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

  let totalCommitsSynced = 0;
  let totalLanguagesSynced = 0;
  let totalDependenciesSynced = 0;

  for (const repo of githubRepositories) {
    const repository = await prisma.repository.upsert({
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

    const commitsSynced = await syncGithubCommits(
      accessToken,
      githubUser.login,
      repo.name,
      repository.id
    );

    totalCommitsSynced += commitsSynced;

    const languagesSynced = await syncGithubLanguages(
      accessToken,
      githubUser.login,
      repo.name,
      repository.id
    );

    totalLanguagesSynced += languagesSynced;

    const dependenciesSynced = await syncGithubDependencies(
      accessToken,
      githubUser.login,
      repo.name,
      repository.id
    );

    totalDependenciesSynced += dependenciesSynced;
  }

  return {
    userId: user.id,
    username: user.username,
    repositoriesSynced: githubRepositories.length,
    commitsSynced: totalCommitsSynced,
    languagesSynced: totalLanguagesSynced,
    dependenciesSynced: totalDependenciesSynced,
  };
}