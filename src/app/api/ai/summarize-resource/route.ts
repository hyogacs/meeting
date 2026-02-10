import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { summarizeResource } from "@/lib/ai";
import { saveResourceAiSummary } from "@/actions/resources";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { resourceId, title, description, url } = await req.json();

  if (!resourceId || !title) {
    return NextResponse.json(
      { error: "resourceId and title are required" },
      { status: 400 }
    );
  }

  try {
    const content = [description, url ? `URL: ${url}` : ""]
      .filter(Boolean)
      .join("\n");
    const summary = await summarizeResource(title, content);
    await saveResourceAiSummary(resourceId, summary);
    return NextResponse.json({ summary });
  } catch (error) {
    console.error("AI summarize resource error:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
