interface RepositoryHealthProps {
  health: {
    score: number;
    issues: string[];
    warnings: string[];
    suggestions: string[];
  };
}

export default function RepositoryHealth({
  health,
}: RepositoryHealthProps) {
  return (
    <div className="rounded-xl bg-zinc-900 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-500">
            Repository Health
          </p>

          <p className="mt-1 text-2xl font-semibold text-white">
            {health.score}/100
          </p>
        </div>
      </div>

      {health.issues.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-red-400">
            Issues
          </p>

          <div className="mt-2 space-y-1">
            {health.issues.map((issue, index) => (
              <p
                key={index}
                className="text-sm text-zinc-400"
              >
                {issue}
              </p>
            ))}
          </div>
        </div>
      )}

      {health.warnings.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-yellow-400">
            Warnings
          </p>

          <div className="mt-2 space-y-1">
            {health.warnings.map((warning, index) => (
              <p
                key={index}
                className="text-sm text-zinc-400"
              >
                {warning}
              </p>
            ))}
          </div>
        </div>
      )}

      {health.suggestions.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-blue-400">
            Suggestions
          </p>

          <div className="mt-2 space-y-1">
            {health.suggestions.map((suggestion, index) => (
              <p
                key={index}
                className="text-sm text-zinc-400"
              >
                {suggestion}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}