import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.text();

  const signature = request.headers.get("x-hub-signature-256");
  const event = request.headers.get("x-github-event");

  if (!signature) {
    return Response.json(
      { error: "Missing webhook signature" },
      { status: 401 }
    );
  }

  const secret = process.env.GITHUB_WEBHOOK_SECRET;

  if (!secret) {
    return Response.json(
      { error: "Webhook secret is not configured" },
      { status: 500 }
    );
  }

  const expectedSignature =
    "sha256=" +
    crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

  const isValid = crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );

  if (!isValid) {
    return Response.json(
      { error: "Invalid webhook signature" },
      { status: 401 }
    );
  }

  const payload = JSON.parse(body);

  console.log("GitHub webhook received:", event);

  if (event === "ping") {
    return Response.json({
      success: true,
      message: "Webhook connected successfully",
    });
  }

  if (event === "push") {
    const githubUsername = payload.sender?.login;

    if (!githubUsername) {
      return Response.json(
        { error: "GitHub user not found in payload" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        username: githubUsername,
      },
    });

    if (!user) {
      return Response.json(
        { error: "DevBuild user not found" },
        { status: 404 }
      );
    }

    const syncJob = await prisma.syncJob.create({
      data: {
        status: "PENDING",
        userId: user.id,
      },
    });

    console.log("Sync job created:", syncJob.id);

    return Response.json({
      success: true,
      message: "Push received",
      jobId: syncJob.id,
    });
  }

  return Response.json({
    success: true,
    message: `Event ${event} received`,
  });
}