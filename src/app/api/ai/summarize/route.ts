import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { summarizeMeeting } from "@/lib/ai";
import { saveMeetingAiSummary } from "@/actions/meetings";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { meetingId, content } = await req.json();

  if (!meetingId || !content) {
    return NextResponse.json(
      { error: "meetingId and content are required" },
      { status: 400 }
    );
  }

  try {
    const summary = await summarizeMeeting(content);
    await saveMeetingAiSummary(meetingId, summary);
    return NextResponse.json({ summary });
  } catch (error) {
    console.error("AI summarize error:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
