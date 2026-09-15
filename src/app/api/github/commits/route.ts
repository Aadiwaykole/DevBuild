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

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);

  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");

  if (!owner || !repo) {
    return Response.json(
      { error: "Owner and repo are required" },
      { status: 400 }
    );
  }

const allCommits: GitHubCommit[] = [];

let page = 1;

while (true) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/commits?per_page=100&page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();

    return Response.json(
      {
        error: "Failed to fetch commits",
        details: error,
      },
      { status: response.status }
    );
  }

  const commits: GitHubCommit[] = await response.json();

  allCommits.push(...commits);

  if (commits.length < 100) {
    break;
  }

  page++;
}

const totalCommits = allCommits.length;

const latestCommit = allCommits[0];

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
  totalCommits,
  latestCommit,
  monthlyActivity,
});
}