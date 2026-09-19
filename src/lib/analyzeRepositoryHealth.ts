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
  const paths = files
    .filter((file) => file.type === "blob")
    .map((file) => file.path.toLowerCase());

  return {
    readme: paths.some((path) => path === "readme.md"),
    gitignore: paths.some((path) => path === ".gitignore"),
    packageJson: paths.some((path) => path === "package.json"),
    typescript: technologies.includes("TypeScript"),
    tests: paths.some(
      (path) =>
        path.includes(".test.") ||
        path.includes(".spec.") ||
        path.includes("__tests__")
    ),
    docker: paths.some(
      (path) =>
        path === "dockerfile" ||
        path === "docker-compose.yml" ||
        path === "docker-compose.yaml"
    ),
    cicd: paths.some(
      (path) =>
        path.startsWith(".github/workflows/")
    ),
    documentation: paths.some(
      (path) =>
        path.endsWith(".md") &&
        path !== "readme.md"
    ),
  };
}