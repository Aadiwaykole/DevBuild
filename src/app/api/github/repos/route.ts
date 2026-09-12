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

  const response = await fetch(
    "https://api.github.com/user/repos?sort=updated&per_page=20",
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

  const repositories = await response.json();

  return Response.json(repositories);
}