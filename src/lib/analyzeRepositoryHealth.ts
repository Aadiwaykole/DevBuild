interface RepositoryHealth {
  readme: boolean;
  gitignore: boolean;
  packageJson: boolean;
  typescript: boolean;
  tests: boolean;
  docker: boolean;
  cicd: boolean;
  documentation: boolean;
}

export function analyzeRepositoryHealth(
  files: { path: string; type: string }[],
  technologies: string[]
): RepositoryHealth {
  const paths = files.map((file) => file.path.toLowerCase());

  return {
    readme: paths.some(
      (path) =>
        path === "readme.md" ||
        path.endsWith("/readme.md")
    ),

    gitignore: paths.some(
      (path) =>
        path === ".gitignore" ||
        path.endsWith("/.gitignore")
    ),

    packageJson: paths.some(
      (path) =>
        path === "package.json" ||
        path.endsWith("/package.json")
    ),

    typescript:
      technologies.includes("TypeScript") ||
      paths.some(
        (path) =>
          path.endsWith(".ts") ||
          path.endsWith(".tsx")
      ),

    tests: paths.some(
      (path) =>
        path.includes(".test.") ||
        path.includes(".spec.") ||
        path.includes("__tests__/") ||
        path.includes("/__tests__/")
    ),

    docker: paths.some(
      (path) =>
        path === "dockerfile" ||
        path.endsWith("/dockerfile") ||
        path === "docker-compose.yml" ||
        path.endsWith("/docker-compose.yml") ||
        path === "docker-compose.yaml" ||
        path.endsWith("/docker-compose.yaml")
    ),

    cicd: paths.some(
      (path) =>
        path.startsWith(".github/workflows/") ||
        path.includes("/.github/workflows/")
    ),

    documentation: paths.some(
      (path) =>
        path.endsWith(".md") &&
        !path.endsWith("readme.md")
    ),
  };
}