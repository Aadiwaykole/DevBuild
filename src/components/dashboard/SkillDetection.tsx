"use client";

import { useEffect, useState } from "react";

interface Skills {
  languages: string[];
  technologies: string[];
  tools: string[];
}

export default function SkillDetection() {
  const [skills, setSkills] = useState<Skills | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSkills() {
      try {
        const response = await fetch("/api/github/skills");

        if (!response.ok) {
          throw new Error("Failed to fetch skills");
        }

        const data = await response.json();

        setSkills(data.skills);
      } catch (error) {
        console.error("Failed to fetch skills:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSkills();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
        <p className="text-sm text-zinc-500">
          Detecting your skills...
        </p>
      </div>
    );
  }

  if (!skills) {
    return null;
  }

  const sections = [
    {
      title: "Languages",
      items: skills.languages,
    },
    {
      title: "Technologies",
      items: skills.technologies,
    },
    {
      title: "Tools",
      items: skills.tools,
    },
  ];

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
      <h2 className="text-lg font-semibold text-white">
        Skills Detected
      </h2>

      <p className="mt-1 text-sm text-zinc-500">
        Technologies and tools detected from your GitHub activity
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {sections.map((section) => (
          <div
            key={section.title}
            className="rounded-xl bg-zinc-900 p-4"
          >
            <p className="text-sm font-medium text-white">
              {section.title}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {section.items.length > 0 ? (
                section.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300"
                  >
                    {item}
                  </span>
                ))
              ) : (
                <span className="text-xs text-zinc-600">
                  None detected
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}