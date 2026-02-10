"use client";

import { useState } from "react";
import { updateMeeting } from "@/actions/meetings";

export function MeetingNotes({
  meetingId,
  initialNotes,
}: {
  meetingId: string;
  initialNotes: string;
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const formData = new FormData();
    formData.set("title", "");
    formData.set("description", "");
    formData.set("scheduledAt", "");
    formData.set("presenterId", "");
    formData.set("notes", notes);
    formData.set("recordingUrl", "");

    // Use a direct db update instead of the full form
    await fetch(`/api/meetings/${meetingId}/notes`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    });

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={12}
        className="w-full rounded-md border border-gray-300 px-4 py-3 font-mono text-sm focus:border-blue-500 focus:outline-none"
        placeholder="在此编写会议记录（支持 Markdown 格式）..."
      />
      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "保存中..." : "保存记录"}
        </button>
        {saved && <span className="text-sm text-green-600">已保存</span>}
      </div>
    </div>
  );
}
