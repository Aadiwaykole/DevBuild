"use client";

import { useState } from "react";

export default function SyncGithubButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSync = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/github/sync", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Sync failed");
      }

      setMessage(
        `${data.data.repositoriesSynced} repositories synchronized`
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <button
        onClick={handleSync}
        disabled={loading}
        className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-50"
      >
        {loading ? "Syncing..." : "Sync GitHub Data"}
      </button>

      {message && (
        <p className="mt-3 text-sm text-zinc-400">
          {message}
        </p>
      )}
    </div>
  );
}