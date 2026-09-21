"use client";

import { useState } from "react";

interface Insights {
    developmentFocus: string;
    strongestSkill: string;
    nextLearningArea: string;
    summary: string;
    recommendations: string[];
}

interface Skills {
    languages: string[];
    technologies: string[];
    tools: string[];
}

export default function AIInsights() {
    const [insights, setInsights] = useState<Insights | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function generateInsights() {
        setLoading(true);
        setError("");

        try {
            const [
                skillsResponse,
                languagesResponse,
                timelineResponse,
                reposResponse,
            ] = await Promise.all([
                fetch("/api/github/skills"),
                fetch("/api/github/languages"),
                fetch("/api/github/timeline"),
                fetch("/api/github/repos"),
            ]);

            if (
                !skillsResponse.ok ||
                !languagesResponse.ok ||
                !timelineResponse.ok ||
                !reposResponse.ok
            ) {
                throw new Error("Failed to fetch GitHub data");
            }

            const skillsData = await skillsResponse.json();
            const languagesData = await languagesResponse.json();
            const timelineData = await timelineResponse.json();
            const reposData = await reposResponse.json();

            const response = await fetch("/api/github/insights", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    skills: skillsData.skills as Skills,
                    languages: languagesData.languageUsage,
                    timeline: timelineData.timeline,
                    repositories: reposData.repositories,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();

                throw new Error(
                    errorData.details ||
                    errorData.error ||
                    "Failed to generate insights"
                );
            }

            const data = await response.json();

            setInsights(data.insights);
        } catch (error) {
            console.error("AI insights error:", error);

            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-white">
                        AI Developer Insights
                    </h2>

                    <p className="mt-1 text-sm text-zinc-500">
                        Get AI-powered insights about your development journey
                    </p>
                </div>

                <button
                    onClick={generateInsights}
                    disabled={loading}
                    className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? "Analyzing..." : "Generate Insights"}
                </button>
            </div>

            {error && (
                <div className="mt-4 rounded-xl border border-red-900 bg-red-950/30 p-4">
                    <p className="text-sm text-red-400">
                        {error}
                    </p>
                </div>
            )}

            {insights && (
                <>
                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                        <div className="rounded-xl bg-zinc-900 p-4">
                            <p className="text-sm text-zinc-500">
                                Development Focus
                            </p>

                            <p className="mt-2 text-base font-medium text-white">
                                {insights.developmentFocus}
                            </p>
                        </div>

                        <div className="rounded-xl bg-zinc-900 p-4">
                            <p className="text-sm text-zinc-500">
                                Strongest Skill
                            </p>

                            <p className="mt-2 text-base font-medium text-white">
                                {insights.strongestSkill}
                            </p>
                        </div>

                        <div className="rounded-xl bg-zinc-900 p-4">
                            <p className="text-sm text-zinc-500">
                                Next Learning Area
                            </p>

                            <p className="mt-2 text-base font-medium text-white">
                                {insights.nextLearningArea}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 rounded-xl bg-zinc-900 p-4">
                        <p className="text-sm font-medium text-white">
                            Developer Growth Summary
                        </p>

                        <p className="mt-2 text-sm leading-6 text-zinc-400">
                            {insights.summary}
                        </p>
                    </div>

                    <div className="mt-4 rounded-xl bg-zinc-900 p-4">
                        <p className="text-sm font-medium text-white">
                            Recommendations
                        </p>

                        <div className="mt-3 space-y-2">
                            {insights.recommendations.map(
                                (recommendation, index) => (
                                    <div
                                        key={index}
                                        className="rounded-lg border border-zinc-800 px-3 py-2 text-sm text-zinc-300"
                                    >
                                        {recommendation}
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}