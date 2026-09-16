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

  const repositoryResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  if (!repositoryResponse.ok) {
    return Response.json(
      { error: "Failed to fetch repository" },
      { status: repositoryResponse.status }
    );
  }

  const repository = await repositoryResponse.json();

  const treeResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${repository.default_branch}?recursive=1`,
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  if (!treeResponse.ok) {
    return Response.json(
      { error: "Failed to fetch repository tree" },
      { status: treeResponse.status }
    );
  }

  const tree = await treeResponse.json();

  return Response.json({
    repository: {
      name: repository.name,
      description: repository.description,
      defaultBranch: repository.default_branch,
    },
    files: tree.tree,
  });
}