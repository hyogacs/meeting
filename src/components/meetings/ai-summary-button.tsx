"use client";

import { useState } from "react";
import { Bot } from "lucide-react";

export function AiSummaryButton({
  meetingId,
  notes,
}: {
  meetingId: string;
  notes: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!notes.trim()) {
      alert("请先编写会议记录");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingId, content: notes }),
      });

      if (!res.ok) throw new Error("Failed to generate summary");

      // Reload to show updated summary
      window.location.reload();
    } catch {
      alert("生成失败，请检查 AI 配置");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGenerate}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
    >
      <Bot className="h-4 w-4" />
      {loading ? "生成中..." : "AI 生成纪要"}
    </button>
  );
}
