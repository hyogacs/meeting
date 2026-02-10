import { getPlanWithTasks } from "@/actions/plans";
import { deletePlan } from "@/actions/plans";
import { TaskList } from "@/components/plans/task-list";
import { AddTaskForm } from "@/components/plans/add-task-form";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const statusLabels: Record<string, { text: string; color: string }> = {
  draft: { text: "草稿", color: "bg-gray-100 text-gray-600" },
  active: { text: "进行中", color: "bg-blue-100 text-blue-700" },
  completed: { text: "已完成", color: "bg-green-100 text-green-700" },
  archived: { text: "已归档", color: "bg-gray-100 text-gray-500" },
};

export default async function PlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const plan = await getPlanWithTasks(id);

  if (!plan) notFound();

  const status = statusLabels[plan.status] || statusLabels.draft;
  const doneTasks = plan.tasks.filter((t) => t.status === "done").length;
  const totalTasks = plan.tasks.length;
  const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      <Link
        href="/plans"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" />
        返回计划列表
      </Link>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{plan.title}</h1>
            {plan.description && (
              <p className="mt-2 text-gray-600">{plan.description}</p>
            )}
            <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${status.color}`}
              >
                {status.text}
              </span>
              {plan.startDate && plan.endDate && (
                <span>
                  {plan.startDate} ~ {plan.endDate}
                </span>
              )}
            </div>
          </div>
          <form
            action={async () => {
              "use server";
              await deletePlan(id);
              redirect("/plans");
            }}
          >
            <button
              type="submit"
              className="rounded-md px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
            >
              删除计划
            </button>
          </form>
        </div>

        {/* Progress bar */}
        {totalTasks > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">
                进度: {doneTasks}/{totalTasks}
              </span>
              <span className="font-medium text-gray-700">{progress}%</span>
            </div>
            <div className="mt-1.5 h-2 w-full rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-blue-600 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Tasks */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">任务列表</h2>
        <AddTaskForm planId={id} />
        <TaskList tasks={plan.tasks} />
      </div>
    </div>
  );
}
