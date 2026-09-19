import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface InsightsRequest {
  skills?: {
    languages?: string[];
    technologies?: string[];
    tools?: string[];
  };
  languages?: Record<string, number>;
  repositories?: number;
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

    const prompt = `
You are analyzing a software developer's GitHub activity.

Generate useful developer growth insights from the following data.

Skills:
${JSON.stringify(body.skills, null, 2)}

Language usage:
${JSON.stringify(body.languages, null, 2)}

Number of repositories:
${body.repositories ?? 0}

Development timeline:
${JSON.stringify(body.timeline, null, 2)}

Return ONLY valid JSON with this structure:

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

Do not invent technologies that are not present in the data.
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

      console.error("OpenRouter error:", errorText);

      return Response.json(
        { error: "Failed to generate AI insights" },
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
      insights = JSON.parse(content);
    } catch {
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