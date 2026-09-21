import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { syncGithubData } from "@/lib/syncGithubData";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const result = await syncGithubData(session.accessToken);

    return Response.json({
      success: true,
      message: "GitHub data synchronized successfully",
      data: result,
    });
  } catch (error) {
    console.error("GITHUB SYNC ERROR:", error);

    return Response.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to synchronize GitHub data",
      },
      { status: 500 }
    );
  }
}   