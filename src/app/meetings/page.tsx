import { getMeetings } from "@/actions/meetings";
import { CreateMeetingForm } from "@/components/meetings/create-meeting-form";
import Link from "next/link";
import { CalendarDays, User } from "lucide-react";

export default async function MeetingsPage() {
  const meetingsList = await getMeetings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">分享会</h1>
        <p className="mt-1 text-sm text-gray-500">
          管理团队的分享会和学习讨论
        </p>
      </div>

      <CreateMeetingForm />

      {meetingsList.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <CalendarDays className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-3 text-sm font-medium text-gray-900">
            还没有分享会
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            创建第一个分享会，开始知识分享
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {meetingsList.map((meeting) => (
            <Link
              key={meeting.id}
              href={`/meetings/${meeting.id}`}
              className="block rounded-lg border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {meeting.title}
                  </h3>
                  {meeting.description && (
                    <p className="mt-1 text-sm text-gray-500">
                      {meeting.description}
                    </p>
                  )}
                </div>
                <span className="whitespace-nowrap text-sm text-gray-400">
                  {meeting.scheduledAt || "待定"}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                {meeting.presenterId && (
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    主讲人已分配
                  </span>
                )}
                {meeting.aiSummary && (
                  <span className="rounded-full bg-purple-50 px-2 py-0.5 text-purple-600">
                    AI 摘要
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
