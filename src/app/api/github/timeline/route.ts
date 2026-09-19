import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
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

  let page = 1;
  const allCommits: GitHubCommit[] = [];

  while (page <= 5) {
    const response = await fetch(
      `https://api.github.com/user/repos?per_page=100&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    if (!response.ok) {
      return Response.json(
        { error: "Failed to fetch repositories" },
        { status: response.status }
      );
    }

    const repos = await response.json();

    if (repos.length === 0) {
      break;
    }

    for (const repo of repos) {
      let commitPage = 1;

      while (commitPage <= 3) {
        const commitResponse = await fetch(
          `https://api.github.com/repos/${repo.owner.login}/${repo.name}/commits?per_page=100&page=${commitPage}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              Accept: "application/vnd.github+json",
            },
          }
        );

        if (!commitResponse.ok) {
          break;
        }

        const commits = await commitResponse.json();

        if (commits.length === 0) {
          break;
        }

        allCommits.push(...commits);

        if (commits.length < 100) {
          break;
        }

        commitPage++;
      }
    }

    if (repos.length < 100) {
      break;
    }

    page++;
  }

  const timeline = allCommits.reduce(
    (
      result: Record<
        string,
        {
          commits: number;
          repositories: Set<string>;
        }
      >,
      commit
    ) => {
      if (!commit.commit.author?.date) {
        return result;
      }

      const date = new Date(commit.commit.author.date);

      const month = date.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      });

      if (!result[month]) {
        result[month] = {
          commits: 0,
          repositories: new Set(),
        };
      }

      result[month].commits++;

      return result;
    },
    {}
  );

  const formattedTimeline = Object.entries(timeline)
    .map(([month, data]) => ({
      month,
      commits: data.commits,
    }))
    .sort(
      (a, b) =>
        new Date(`1 ${a.month}`).getTime() -
        new Date(`1 ${b.month}`).getTime()
    );

  return Response.json({
    timeline: formattedTimeline,
  });
}