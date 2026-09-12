import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  };

  const response = await fetch(
    "https://api.github.com/user/repos?sort=updated&per_page=20",
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch repositories");
  }

  const repositories = await response.json();

   return (
    <main className="min-h-screen bg-black px-6 py-24 text-white">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm text-zinc-500">
          YOUR DEVELOPMENT JOURNEY
        </p>

        <h1 className="mt-3 text-4xl font-semibold">
          Welcome back, {session.user?.name}
        </h1>

        <p className="mt-3 text-zinc-400">
          Your GitHub repositories
        </p>

        <div className="mt-10 grid gap-4">
          {repositories.map((repo: any) => (
            <div
              key={repo.id}
              className="rounded-xl border border-zinc-800 bg-zinc-950 p-6"
            >
              <h2 className="text-xl font-semibold">
                {repo.name}
              </h2>

              <p className="mt-2 text-sm text-zinc-400">
                {repo.description || "No description"}
              </p>

              <div className="mt-4 flex gap-4 text-sm text-zinc-500">
                <span>{repo.language || "Unknown"}</span>
                <span>★ {repo.stargazers_count}</span>
                <span>⑂ {repo.forks_count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}