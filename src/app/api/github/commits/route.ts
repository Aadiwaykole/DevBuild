import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const owner = "Aadiwaykole";
  const repo = "DevBuild";

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

  return Response.json(commits);
}