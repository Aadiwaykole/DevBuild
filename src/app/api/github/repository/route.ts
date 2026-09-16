import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { detectTechnologies } from "@/lib/repositoryAnalysis";
import { analyzeArchitecture } from "@/lib/architectureAnalysis";

interface GitHubTreeItem {
  path: string;
  type: string;
}

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
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

  const files: GitHubTreeItem[] = tree.tree;

  const packageFile = files.find(
    (file) => file.path === "package.json"
  );

  let packageJson: PackageJson | null = null;

  if (packageFile) {
    const packageResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${packageFile.path}`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    if (packageResponse.ok) {
      const packageData = await packageResponse.json();

      const packageContent = Buffer.from(
        packageData.content,
        "base64"
      ).toString("utf-8");

      packageJson = JSON.parse(packageContent);
    }
  }

  const technologies = packageJson
    ? detectTechnologies(
        packageJson.dependencies || {},
        packageJson.devDependencies || {}
      )
    : [];

    const architecture = analyzeArchitecture(
  files,
  packageJson?.dependencies || {},
  packageJson?.devDependencies || {}
);

  return Response.json({
    repository: {
      name: repository.name,
      description: repository.description,
      defaultBranch: repository.default_branch,
    },

    analysis: {
  hasPackageJson: !!packageFile,
  technologies,
  architecture,
  dependencies: packageJson?.dependencies || {},
  devDependencies: packageJson?.devDependencies || {},
},

    files,
  });
}