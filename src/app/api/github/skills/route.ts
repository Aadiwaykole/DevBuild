
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
    "https://api.github.com/user/repos?per_page=100",
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

  const languages = new Set<string>();
  const technologies = new Set<string>();
  const tools = new Set<string>();

  for (const repo of repositories) {
    if (repo.language) {
      languages.add(repo.language);
    }

    if (repo.name) {
      const name = repo.name.toLowerCase();

      if (
        name.includes("react") ||
        name.includes("frontend")
      ) {
        technologies.add("React");
      }

      if (
        name.includes("next") ||
        name.includes("nextjs")
      ) {
        technologies.add("Next.js");
      }

      if (
        name.includes("node") ||
        name.includes("backend")
      ) {
        technologies.add("Node.js");
      }

      if (name.includes("express")) {
        technologies.add("Express.js");
      }
    }
  }

  if (repositories.length > 0) {
    tools.add("Git");
    tools.add("GitHub");
  }

  return Response.json({
    skills: {
      languages: Array.from(languages),
      technologies: Array.from(technologies),
      tools: Array.from(tools),
    },
  });
}