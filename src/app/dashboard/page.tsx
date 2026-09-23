import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import RepositoryCard from "@/components/dashboard/RepositoryCard";
import CommitActivity from "@/components/dashboard/CommitActivity";
import DeveloperActivity from "@/components/dashboard/DeveloperActivity";
import LanguageAnalysis from "@/components/dashboard/LanguageAnalysis";
import DeveloperTimeline from "@/components/dashboard/DeveloperTimeline";
import SkillDetection from "@/components/dashboard/SkillDetection";
import AIInsights from "@/components/dashboard/AIInsights";
import SyncGithubButton from "@/components/dashboard/SyncGithubButton";
import { prisma } from "@/lib/prisma";

interface GitHubRepository {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  created_at: string;
  updated_at: string;
  default_branch: string;
  open_issues_count: number;
  size: number;
  html_url: string;
  owner: {
    login: string;
  };
}


export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    redirect("/");
  }
  const githubResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      Accept: "application/vnd.github+json",
    },
  });

  if (!githubResponse.ok) {
    redirect("/");
  }

  const githubUser = await githubResponse.json();

  const user = await prisma.user.findUnique({
    where: {
      githubId: String(githubUser.id),
    },
  });

  if (!user) {
    throw new Error("User not found. Please sync GitHub data first.");
  }

  const repositories = await prisma.repository.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      githubUpdatedAt: "desc",
    },
  });

  const totalRepositories = repositories.length;

  const totalStars = repositories.reduce(
    (total, repo) => total + repo.stars,
    0
  );

  const totalForks = repositories.reduce(
    (total, repo) => total + repo.forks,
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
        <SyncGithubButton />

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

        <DeveloperActivity />
        <DeveloperTimeline />
        <SkillDetection />
        <AIInsights />
        <LanguageAnalysis />

        <div className="mt-16">
          <h2 className="text-2xl font-semibold">
            Your Repositories
          </h2>

          <div className="mt-6 grid gap-4">
            {repositories.map((repo) => (
              <RepositoryCard
                key={repo.id}
                owner={user.username}
                name={repo.name}
                description={repo.description}
                language={repo.language}
                stars={repo.stars}
                forks={repo.forks}
                createdAt={repo.githubCreatedAt?.toISOString() ?? ""}
                updatedAt={repo.githubUpdatedAt?.toISOString() ?? ""}
                defaultBranch={repo.defaultBranch ?? ""}
                openIssues={repo.openIssues}
                size={repo.size}
                url={repo.htmlUrl ?? ""}
              />
            ))}

          </div>

        </div>
      </div>
    </main>
  );
}