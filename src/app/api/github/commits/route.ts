import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/commits`,
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

  const commits = await response.json();

  const totalCommits = commits.length;

  const latestCommit = commits[0];

  return Response.json({
    totalCommits,
    latestCommit,
  });
}