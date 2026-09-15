import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import RepositoryCard from "@/components/dashboard/RepositoryCard";
import CommitActivity from "@/components/dashboard/CommitActivity";


interface GitHubRepository {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  owner: {
    login: string;
  };
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    redirect("/");
  }

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

  const repositories: GitHubRepository[] = await response.json();

  const totalRepositories = repositories.length;

  const totalStars = repositories.reduce(
    (total, repo) => total + repo.stargazers_count,
    0
  );

  const totalForks = repositories.reduce(
    (total, repo) => total + repo.forks_count,
    0
  );

  const languages = new Set(
    repositories
      .map((repo) => repo.language)
      .filter(Boolean)
  );

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
          Understand your development activity.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-sm text-zinc-500">Repositories</p>
            <p className="mt-3 text-3xl font-semibold">
              {totalRepositories}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-sm text-zinc-500">Languages</p>
            <p className="mt-3 text-3xl font-semibold">
              {languages.size}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-sm text-zinc-500">Stars</p>
            <p className="mt-3 text-3xl font-semibold">
              {totalStars}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-sm text-zinc-500">Forks</p>
            <p className="mt-3 text-3xl font-semibold">
              {totalForks}
            </p>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-semibold">
            Your Repositories
          </h2>

          <div className="mt-6 grid gap-4">
            {repositories.map((repo) => (
              <RepositoryCard
                key={repo.id}
                owner={repo.owner.login}
                name={repo.name}
                description={repo.description}
                language={repo.language}
                stars={repo.stargazers_count}
                forks={repo.forks_count}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}