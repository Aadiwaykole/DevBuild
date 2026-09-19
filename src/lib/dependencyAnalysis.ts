interface DependencyAnalysis {
  frameworks: string[];
  frontend: string[];
  backend: string[];
  databases: string[];
  authentication: string[];
  ui: string[];
  testing: string[];
  development: string[];
}

export function analyzeDependencies(
  dependencies: Record<string, string>,
  devDependencies: Record<string, string>
): DependencyAnalysis {
  const allDependencies = {
    ...dependencies,
    ...devDependencies,
  };

  const result: DependencyAnalysis = {
    frameworks: [],
    frontend: [],
    backend: [],
    databases: [],
    authentication: [],
    ui: [],
    testing: [],
    development: [],
  };

  for (const dependency of Object.keys(allDependencies)) {
    if (
      dependency === "next" ||
      dependency === "react" ||
      dependency === "react-dom"
    ) {
      result.frameworks.push(dependency);
    }

    if (
      dependency === "react" ||
      dependency === "react-dom" ||
      dependency === "next"
    ) {
      result.frontend.push(dependency);
    }

    if (
      dependency === "express" ||
      dependency === "fastify" ||
      dependency === "nestjs"
    ) {
      result.backend.push(dependency);
    }

    if (
      dependency === "mongoose" ||
      dependency === "mongodb" ||
      dependency === "pg" ||
      dependency === "prisma" ||
      dependency === "@prisma/client"
    ) {
      result.databases.push(dependency);
    }

    if (
      dependency === "next-auth" ||
      dependency === "passport" ||
      dependency === "jsonwebtoken" ||
      dependency === "bcryptjs"
    ) {
      result.authentication.push(dependency);
    }

    if (
      dependency === "tailwindcss" ||
      dependency === "lucide-react" ||
      dependency === "recharts" ||
      dependency === "framer-motion"
    ) {
      result.ui.push(dependency);
    }

    if (
      dependency === "jest" ||
      dependency === "vitest" ||
      dependency === "@testing-library/react" ||
      dependency === "@testing-library/jest-dom"
    ) {
      result.testing.push(dependency);
    }

    if (
      dependency === "typescript" ||
      dependency === "eslint" ||
      dependency === "prettier"
    ) {
      result.development.push(dependency);
    }
  }

  return result;
}