import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface GitHubRepository {
  owner: {
    login: string;
  };
  name: string;
}

interface GitHubCommit {
  commit: {
    author: {
      date: string;
    } | null;
  };
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

  const allCommits: GitHubCommit[] = [];

  for (const repo of repositories) {
    const response = await fetch(
      `https://api.github.com/repos/${repo.owner.login}/${repo.name}/commits?per_page=100`,
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

    const commits: GitHubCommit[] = await response.json();

    allCommits.push(...commits);
  }

  const monthlyActivity = allCommits.reduce(
    (activity: Record<string, number>, commit) => {
      const date = commit.commit.author?.date;

      if (!date) {
        return activity;
      }

      const month = new Date(date).toISOString().slice(0, 7);

      activity[month] = (activity[month] || 0) + 1;

      return activity;
    },
    {}
  );

  return Response.json({
    totalCommits: allCommits.length,
    monthlyActivity,
  });
}