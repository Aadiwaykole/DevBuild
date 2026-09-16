const technologyMap: Record<string, string> = {
  next: "Next.js",
  react: "React",
  "next-auth": "NextAuth",
  recharts: "Recharts",
  "lucide-react": "Lucide React",
  express: "Express.js",
  mongoose: "Mongoose",
  prisma: "Prisma",
  "@prisma/client": "Prisma",
  tailwindcss: "Tailwind CSS",
  typescript: "TypeScript",
  axios: "Axios",
  zod: "Zod",
};

export function detectTechnologies(
  dependencies: Record<string, string>,
  devDependencies: Record<string, string>
) {
  const allDependencies = {
    ...dependencies,
    ...devDependencies,
  };

  const technologies = new Set<string>();

  for (const dependency of Object.keys(allDependencies)) {
    const technology = technologyMap[dependency];

    if (technology) {
      technologies.add(technology);
    }
  }

  return Array.from(technologies);
}