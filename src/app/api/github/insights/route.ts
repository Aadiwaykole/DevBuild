import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface Repository {
  name: string;
  description?: string | null;
  language?: string | null;
  stargazers_count?: number;
  forks_count?: number;
  topics?: string[];
}

interface InsightsRequest {
  skills?: {
    languages?: string[];
    technologies?: string[];
    tools?: string[];
  };

  languages?: Record<string, number>;

  repositories?: Repository[];

  timeline?: {
    month: string;
    commits: number;
  }[];
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body: InsightsRequest = await request.json();

    const repositories = body.repositories || [];

    const repositorySummary = repositories.map((repo) => ({
      name: repo.name,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      topics: repo.topics,
    }));

    const prompt = `
You are analyzing a software developer's GitHub profile.

Your job is to identify realistic developer growth patterns from the provided GitHub data.

Do not invent technologies, skills, projects, or experience that are not supported by the data.

Developer Skills:
${JSON.stringify(body.skills, null, 2)}

Language Usage:
${JSON.stringify(body.languages, null, 2)}

Repositories:
${JSON.stringify(repositorySummary, null, 2)}

Development Timeline:
${JSON.stringify(body.timeline, null, 2)}

Analyze:

1. The developer's main development focus.
2. The strongest demonstrated skill based on the available evidence.
3. A reasonable next learning area based on their existing technology stack.
4. A concise summary of their development journey.
5. Three practical recommendations for improving as a developer.

Consider:
- Repeated technologies across repositories
- Programming languages
- Repository topics
- Project descriptions
- Development activity
- Commit activity
- Technology progression

Return ONLY valid JSON.

Use exactly this structure:

{
  "developmentFocus": "string",
  "strongestSkill": "string",
  "nextLearningArea": "string",
  "summary": "string",
  "recommendations": [
    "string",
    "string",
    "string"
  ]
}

Keep the recommendations practical and specific.

Do not claim professional experience unless the GitHub data clearly supports it.
`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openrouter/free",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.3,
        }),
      }
    );

if (!response.ok) {
  const errorText = await response.text();

  console.error(
    "OpenRouter error:",
    response.status,
    errorText
  );

  return Response.json(
    {
      error: "OpenRouter request failed",
      status: response.status,
      details: errorText,
    },
    { status: 500 }
  );
}

    const data = await response.json();

    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return Response.json(
        { error: "AI returned an empty response" },
        { status: 500 }
      );
    }

    let insights;

    try {
      const cleanedContent = content
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const jsonStart = cleanedContent.indexOf("{");
      const jsonEnd = cleanedContent.lastIndexOf("}");

      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error("No JSON object found");
      }

      const jsonContent = cleanedContent.slice(
        jsonStart,
        jsonEnd + 1
      );

      insights = JSON.parse(jsonContent);
    } catch (error) {
      console.error("Invalid AI JSON:", content);

      return Response.json(
        { error: "AI returned invalid JSON" },
        { status: 500 }
      );
    }

    return Response.json({
      insights,
    });
  } catch (error) {
    console.error("AI insights error:", error);

    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}