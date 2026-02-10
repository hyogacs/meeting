import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { chat } from "@/lib/ai";
import { db } from "@/db";
import { meetings, resources, tasks } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { message } = await req.json();

  if (!message) {
    return NextResponse.json(
      { error: "message is required" },
      { status: 400 }
    );
  }

  try {
    // Build context from team's data
    const recentMeetings = await db
      .select()
      .from(meetings)
      .orderBy(desc(meetings.createdAt))
      .limit(5);

    const allResources = await db
      .select()
      .from(resources)
      .orderBy(desc(resources.createdAt))
      .limit(20);

    const recentTasks = await db
      .select()
      .from(tasks)
      .orderBy(desc(tasks.createdAt))
      .limit(10);

    const context = [
      "## 最近会议记录",
      ...recentMeetings.map(
        (m) =>
          `- ${m.title}: ${m.notes?.slice(0, 500) || "无记录"}`
      ),
      "",
      "## 学习资源",
      ...allResources.map(
        (r) => `- [${r.type}] ${r.title}: ${r.description || r.url || ""}`
      ),
      "",
      "## 当前任务",
      ...recentTasks.map(
        (t) => `- [${t.status}] ${t.title}: ${t.note?.slice(0, 200) || ""}`
      ),
    ].join("\n");

    const reply = await chat(message, context);
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("AI chat error:", error);
    return NextResponse.json(
      { error: "Failed to get response" },
      { status: 500 }
    );
  }
}
