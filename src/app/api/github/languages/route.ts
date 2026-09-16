import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface GitHubRepository {
  owner: {
    login: string;
  };
  name: string;
}

interface GitHubLanguages {
  [language: string]: number;
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const repositoriesResponse = await fetch(
    "https://api.github.com/user/repos?sort=updated&per_page=20",
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  if (!repositoriesResponse.ok) {
    return Response.json(
      { error: "Failed to fetch repositories" },
      { status: repositoriesResponse.status }
    );
  }

  const repositories: GitHubRepository[] =
    await repositoriesResponse.json();

  const languageUsage: Record<string, number> = {};

  for (const repo of repositories) {
    const response = await fetch(
      `https://api.github.com/repos/${repo.owner.login}/${repo.name}/languages`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    if (!response.ok) {
      continue;
    }

    const languages: GitHubLanguages = await response.json();

    for (const [language, bytes] of Object.entries(languages)) {
      languageUsage[language] =
        (languageUsage[language] || 0) + bytes;
    }
  }

  return Response.json({
    languageUsage,
  });
}