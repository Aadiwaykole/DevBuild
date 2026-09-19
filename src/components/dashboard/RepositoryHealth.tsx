interface RepositoryHealthProps {
  health: {
    readme: boolean;
    gitignore: boolean;
    packageJson: boolean;
    typescript: boolean;
    tests: boolean;
    docker: boolean;
    cicd: boolean;
    documentation: boolean;
  };
}

export default function RepositoryHealth({
  health,
}: RepositoryHealthProps) {
  const checks = [
    {
      name: "README",
      description: "Project has a README file",
      value: health.readme,
    },
    {
      name: "Gitignore",
      description: "Project has a .gitignore file",
      value: health.gitignore,
    },
    {
      name: "Package.json",
      description: "Project has package configuration",
      value: health.packageJson,
    },
    {
      name: "TypeScript",
      description: "Project uses TypeScript",
      value: health.typescript,
    },
    {
      name: "Tests",
      description: "Project contains test files",
      value: health.tests,
    },
    {
      name: "Docker",
      description: "Project has Docker configuration",
      value: health.docker,
    },
    {
      name: "CI/CD",
      description: "Project has GitHub Actions workflows",
      value: health.cicd,
    },
    {
      name: "Documentation",
      description: "Project contains additional documentation",
      value: health.documentation,
    },
  ];

  const completedChecks = checks.filter((check) => check.value).length;
  const score = Math.round((completedChecks / checks.length) * 100);

  return (
    <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Repository Health
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Codebase quality and project maturity analysis
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-zinc-500">
            Health Score
          </p>

          <p className="mt-1 text-3xl font-semibold text-white">
            {score}
            <span className="text-lg text-zinc-500">
              /100
            </span>
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {checks.map((check) => (
          <div
            key={check.name}
            className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 p-4"
          >
            <div>
              <p className="text-sm font-medium text-white">
                {check.name}
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                {check.description}
              </p>
            </div>

            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                check.value
                  ? "bg-green-500/10 text-green-400"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              {check.value ? "✓" : "✕"}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
        <p className="text-sm font-medium text-white">
          Health Summary
        </p>

        <p className="mt-2 text-sm text-zinc-500">
          {completedChecks} of {checks.length} repository health checks passed.
        </p>
      </div>
    </div>
  );
}