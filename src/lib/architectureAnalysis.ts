interface RepositoryFile {
  path: string;
  type: string;
}

interface ArchitectureAnalysis {
  projectType: string;
  architecture: string;
  frontend: boolean;
  backend: boolean;
  database: string[];
}

export function analyzeArchitecture(
  files: RepositoryFile[],
  dependencies: Record<string, string>,
  devDependencies: Record<string, string>
): ArchitectureAnalysis {
  const paths = files.map((file) => file.path);

  const allDependencies = {
    ...dependencies,
    ...devDependencies,
  };

  const hasFrontend =
    paths.some((path) =>
      path.startsWith("src/app")
    ) ||
    paths.some((path) =>
      path.startsWith("src/components")
    ) ||
    "react" in allDependencies ||
    "next" in allDependencies;

  const hasBackend =
    paths.some((path) =>
      path.startsWith("backend")
    ) ||
    "express" in allDependencies;

  const database: string[] = [];

  if ("mongoose" in allDependencies) {
    database.push("MongoDB");
  }

  if ("prisma" in allDependencies) {
    database.push("Database via Prisma");
  }

  if (
    paths.some((path) =>
      path.toLowerCase().includes("schema")
    )
  ) {
    database.push("Schema-based data model");
  }

  let projectType = "Unknown";

  if (hasFrontend && hasBackend) {
    projectType = "Full-stack Application";
  } else if (hasFrontend) {
    projectType = "Frontend Application";
  } else if (hasBackend) {
    projectType = "Backend Application";
  }

  let architecture = "Unknown";

  const hasControllers = paths.some((path) =>
    path.toLowerCase().includes("controllers/")
  );

  const hasModels = paths.some((path) =>
    path.toLowerCase().includes("model/")
  );

  const hasRoutes = paths.some((path) =>
    path.toLowerCase().includes("routes/")
  );

  if (hasControllers && hasModels && hasRoutes) {
    architecture = "MVC-like Architecture";
  } else if (hasFrontend && hasBackend) {
    architecture = "Full-stack Architecture";
  } else if (hasFrontend) {
    architecture = "Component-based Frontend";
  } else if (hasBackend) {
    architecture = "Backend Service";
  }

  return {
    projectType,
    architecture,
    frontend: hasFrontend,
    backend: hasBackend,
    database,
  };
}