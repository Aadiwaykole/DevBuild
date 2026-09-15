"use client";

import { useState } from "react";

interface RepositoryCardProps {
  owner: string;
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
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
}

export default function RepositoryCard({
  owner,
  name,
  description,
  language,
  stars,
  forks,
}: RepositoryCardProps) {
  const [commits, setCommits] = useState<CommitResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleViewCommits() {
    setLoading(true);

    const response = await fetch(
      `/api/github/commits?owner=${owner}&repo=${name}`
    );

    const data = await response.json();

    setCommits(data);
    setLoading(false);
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
      <h3 className="text-xl font-semibold">{name}</h3>

      <p className="mt-2 text-sm text-zinc-400">
        {description || "No description"}
      </p>

      <div className="mt-4 flex gap-5 text-sm text-zinc-500">
        <span>{language || "Unknown"}</span>
        <span>★ {stars}</span>
        <span>Forks {forks}</span>
      </div>

      <button
        onClick={handleViewCommits}
        className="mt-5 cursor-pointer rounded-lg border border-zinc-700 px-4 py-2 text-sm transition hover:bg-zinc-800"
      >
        {loading ? "Loading..." : "View Commits"}
      </button>

      {commits && (
        <div className="mt-5 border-t border-zinc-800 pt-5">
          <p className="text-sm text-zinc-500">
            Total commits
          </p>

          <p className="mt-1 text-2xl font-semibold">
            {commits.totalCommits}
          </p>

          <p className="mt-4 text-sm text-zinc-500">
            Latest commit
          </p>

          <p className="mt-1 text-sm text-zinc-300">
            {commits.latestCommit?.commit.message}
          </p>
        </div>
      )}
    </div>
  );
}