import { getMeeting, deleteMeeting } from "@/actions/meetings";
import { MeetingNotes } from "@/components/meetings/meeting-notes";
import { AiSummaryButton } from "@/components/meetings/ai-summary-button";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function MeetingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meeting = await getMeeting(id);

  if (!meeting) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/meetings"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" />
        返回分享会列表
      </Link>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {meeting.title}
            </h1>
            {meeting.description && (
              <p className="mt-2 text-gray-600">{meeting.description}</p>
            )}
            <div className="mt-3 text-sm text-gray-500">
              {meeting.scheduledAt || "时间待定"}
            </div>
          </div>
          <form
            action={async () => {
              "use server";
              await deleteMeeting(id);
              redirect("/meetings");
            }}
          >
            <button
              type="submit"
              className="rounded-md px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
            >
              删除
            </button>
          </form>
        </div>

        {meeting.recordingUrl && (
          <div className="mt-4">
            <a
              href={meeting.recordingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              查看录屏
            </a>
          </div>
        )}
      </div>

      {/* Meeting Notes */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">会议记录</h2>
        <MeetingNotes meetingId={id} initialNotes={meeting.notes || ""} />
      </div>

      {/* AI Summary */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">AI 纪要</h2>
          <AiSummaryButton meetingId={id} notes={meeting.notes || ""} />
        </div>
        {meeting.aiSummary ? (
          <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-600">
            {meeting.aiSummary}
          </div>
        ) : (
          <p className="text-sm text-gray-400">
            还没有 AI 纪要，在上方编写会议记录后点击生成
          </p>
        )}
      </div>
    </div>
  );
}
