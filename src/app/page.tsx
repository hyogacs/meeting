import { db } from "@/db";
import { studyPlans, tasks, meetings, resources } from "@/db/schema";
import { eq, count, desc } from "drizzle-orm";
import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  FolderOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";

export default async function Dashboard() {
  const plans = await db
    .select()
    .from(studyPlans)
    .where(eq(studyPlans.status, "active"))
    .orderBy(desc(studyPlans.createdAt))
    .limit(5);

  const [taskStats] = await db
    .select({
      total: count(),
    })
    .from(tasks);

  const [doneStats] = await db
    .select({
      total: count(),
    })
    .from(tasks)
    .where(eq(tasks.status, "done"));

  const upcomingMeetings = await db
    .select()
    .from(meetings)
    .orderBy(desc(meetings.scheduledAt))
    .limit(3);

  const [resourceCount] = await db
    .select({ total: count() })
    .from(resources);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          AI 学习小组学习进度总览
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<BookOpen className="h-5 w-5 text-blue-600" />}
          label="进行中计划"
          value={plans.length}
          bg="bg-blue-50"
        />
        <StatCard
          icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
          label="已完成任务"
          value={`${doneStats.total}/${taskStats.total}`}
          bg="bg-green-50"
        />
        <StatCard
          icon={<CalendarDays className="h-5 w-5 text-purple-600" />}
          label="分享会"
          value={upcomingMeetings.length}
          bg="bg-purple-50"
        />
        <StatCard
          icon={<FolderOpen className="h-5 w-5 text-orange-600" />}
          label="学习资源"
          value={resourceCount.total}
          bg="bg-orange-50"
        />
      </div>

      {/* Active Plans */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            进行中的学习计划
          </h2>
          <Link
            href="/plans"
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
          >
            查看全部 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {plans.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">还没有学习计划</p>
            <Link
              href="/plans"
              className="mt-3 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              创建第一个计划
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <Link
                key={plan.id}
                href={`/plans/${plan.id}`}
                className="rounded-lg border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
              >
                <h3 className="font-semibold text-gray-900">{plan.title}</h3>
                {plan.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                    {plan.description}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                  <Clock className="h-3.5 w-3.5" />
                  {plan.startDate && plan.endDate
                    ? `${plan.startDate} ~ ${plan.endDate}`
                    : "未设置时间"}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Upcoming Meetings */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">最近分享会</h2>
          <Link
            href="/meetings"
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
          >
            查看全部 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {upcomingMeetings.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
            <CalendarDays className="mx-auto h-10 w-10 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">还没有分享会</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingMeetings.map((meeting) => (
              <Link
                key={meeting.id}
                href={`/meetings/${meeting.id}`}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-4 transition-shadow hover:shadow-md"
              >
                <div>
                  <h3 className="font-medium text-gray-900">
                    {meeting.title}
                  </h3>
                  {meeting.description && (
                    <p className="mt-0.5 text-sm text-gray-500">
                      {meeting.description}
                    </p>
                  )}
                </div>
                <span className="whitespace-nowrap text-sm text-gray-400">
                  {meeting.scheduledAt || "待定"}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  bg: string;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <div className={`rounded-lg p-2.5 ${bg}`}>{icon}</div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
