"use client";

import { useState } from "react";
import CommitActivity from "./CommitActivity";

interface RepositoryCardProps {
  owner: string;
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  createdAt: string;
  updatedAt: string;
  defaultBranch: string;
  openIssues: number;
  size: number;
  url: string;
}

interface Commit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    } | null;
  };
}

interface CommitResponse {
  totalCommits: number;
  latestCommit: Commit;
  monthlyActivity: Record<string, number>;
}

interface RepositoryFile {
  path: string;
  type: string;
}

interface RepositoryAnalysis {
  repository: {
    name: string;
    description: string | null;
    defaultBranch: string;
  };

  analysis: {
    hasPackageJson: boolean;
    technologies: string[];

    architecture: {
      projectType: string;
      architecture: string;
      frontend: boolean;
      backend: boolean;
      database: string[];
    };

    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
  };

  files: RepositoryFile[];
}

export default function RepositoryCard({
  owner,
  name,
  description,
  language,
  stars,
  forks,
  createdAt,
  updatedAt,
  defaultBranch,
  openIssues,
  size,
  url,
}: RepositoryCardProps) {
  const [commits, setCommits] = useState<CommitResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const [repositoryAnalysis, setRepositoryAnalysis] =
    useState<RepositoryAnalysis | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  async function handleViewCommits() {
    setLoading(true);

    try {
      const response = await fetch(
        `/api/github/commits?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(name)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch commits");
      }

      const data = await response.json();

      setCommits(data);
    } catch (error) {
      console.error("Failed to fetch commits:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAnalyzeRepository() {
    setAnalysisLoading(true);

    try {
      const response = await fetch(
        `/api/github/repository?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(name)}`
      );

      if (!response.ok) {
        throw new Error("Failed to analyze repository");
      }

      const data: RepositoryAnalysis = await response.json();

      setRepositoryAnalysis(data);
    } catch (error) {
      console.error("Repository analysis failed:", error);
    } finally {
      setAnalysisLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-white">
            {name}
          </h3>

          <p className="mt-2 text-sm text-zinc-400">
            {description || "No description"}
          </p>
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800"
        >
          GitHub
        </a>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-xl bg-zinc-900 p-3">
          <p className="text-xs text-zinc-500">
            Language
          </p>

          <p className="mt-1 text-sm text-white">
            {language || "Unknown"}
          </p>
        </div>

        <div className="rounded-xl bg-zinc-900 p-3">
          <p className="text-xs text-zinc-500">
            Branch
          </p>

          <p className="mt-1 text-sm text-white">
            {defaultBranch}
          </p>
        </div>

        <div className="rounded-xl bg-zinc-900 p-3">
          <p className="text-xs text-zinc-500">
            Open Issues
          </p>

          <p className="mt-1 text-sm text-white">
            {openIssues}
          </p>
        </div>

        <div className="rounded-xl bg-zinc-900 p-3">
          <p className="text-xs text-zinc-500">
            Size
          </p>

          <p className="mt-1 text-sm text-white">
            {size.toLocaleString()} KB
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-5 text-sm text-zinc-500">
        <span>
          ★ {stars}
        </span>

        <span>
          Forks {forks}
        </span>

        <span>
          Created {new Date(createdAt).toLocaleDateString()}
        </span>

        <span>
          Updated {new Date(updatedAt).toLocaleDateString()}
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleViewCommits}
          className="mt-6 cursor-pointer rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800"
        >
          {loading ? "Loading..." : "View Commits"}
        </button>

        <button
          onClick={handleAnalyzeRepository}
          className="mt-6 cursor-pointer rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800"
        >
          {analysisLoading
            ? "Analyzing..."
            : "Analyze Repository"}
        </button>
      </div>

      {commits && (
        <div className="mt-5 border-t border-zinc-800 pt-5">
          <p className="text-sm text-zinc-500">
            Total commits
          </p>

          <p className="mt-1 text-2xl font-semibold text-white">
            {commits.totalCommits}
          </p>

          <p className="mt-4 text-sm text-zinc-500">
            Latest commit
          </p>

          <p className="mt-1 text-sm text-zinc-300">
            {commits.latestCommit?.commit.message}
          </p>

          <CommitActivity
            monthlyActivity={commits.monthlyActivity}
          />
        </div>
      )}

      {repositoryAnalysis && (
        <div className="mt-5 border-t border-zinc-800 pt-5">

          <h3 className="text-lg font-semibold text-white">
            Technology Stack
          </h3>

          <div className="mt-4 flex flex-wrap gap-2">
            {repositoryAnalysis.analysis.technologies.map(
              (technology) => (
                <span
                  key={technology}
                  className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-300"
                >
                  {technology}
                </span>
              )
            )}
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl bg-zinc-900 p-4">
              <p className="text-xs text-zinc-500">
                Project Type
              </p>

              <p className="mt-1 text-sm text-white">
                {repositoryAnalysis.analysis.architecture.projectType}
              </p>
            </div>

            <div className="rounded-xl bg-zinc-900 p-4">
              <p className="text-xs text-zinc-500">
                Architecture
              </p>

              <p className="mt-1 text-sm text-white">
                {repositoryAnalysis.analysis.architecture.architecture}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs text-zinc-500">
              Database
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              {repositoryAnalysis.analysis.architecture.database.length > 0 ? (
                repositoryAnalysis.analysis.architecture.database.map(
                  (database) => (
                    <span
                      key={database}
                      className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-300"
                    >
                      {database}
                    </span>
                  )
                )
              ) : (
                <span className="text-sm text-zinc-600">
                  None detected
                </span>
              )}
            </div>
          </div>

          <h3 className="mt-8 text-lg font-semibold text-white">
            Repository Structure
          </h3>

          <p className="mt-1 text-sm text-zinc-500">
            Default branch:{" "}
            {repositoryAnalysis.repository.defaultBranch}
          </p>

          <div className="mt-5 max-h-96 overflow-y-auto rounded-xl bg-zinc-900 p-4">
            {repositoryAnalysis.files.map((file) => (
              <div
                key={file.path}
                className="flex items-center justify-between border-b border-zinc-800 py-2 last:border-b-0"
              >
                <span className="text-sm text-zinc-300">
                  {file.path}
                </span>

                <span className="text-xs text-zinc-600">
                  {file.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}