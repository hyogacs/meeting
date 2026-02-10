import { getPlans } from "@/actions/plans";
import { CreatePlanForm } from "@/components/plans/create-plan-form";
import Link from "next/link";
import { BookOpen, Clock } from "lucide-react";

const statusLabels: Record<string, { text: string; color: string }> = {
  draft: { text: "草稿", color: "bg-gray-100 text-gray-600" },
  active: { text: "进行中", color: "bg-blue-100 text-blue-700" },
  completed: { text: "已完成", color: "bg-green-100 text-green-700" },
  archived: { text: "已归档", color: "bg-gray-100 text-gray-500" },
};

export default async function PlansPage() {
  const plans = await getPlans();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">学习计划</h1>
          <p className="mt-1 text-sm text-gray-500">
            管理团队的学习主题和进度
          </p>
        </div>
      </div>

      <CreatePlanForm />

      {plans.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-3 text-sm font-medium text-gray-900">
            还没有学习计划
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            创建第一个学习计划，开始你们的学习之旅
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => {
            const status = statusLabels[plan.status] || statusLabels.draft;
            return (
              <Link
                key={plan.id}
                href={`/plans/${plan.id}`}
                className="group rounded-lg border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                    {plan.title}
                  </h3>
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${status.color}`}
                  >
                    {status.text}
                  </span>
                </div>
                {plan.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                    {plan.description}
                  </p>
                )}
                <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                  <Clock className="h-3.5 w-3.5" />
                  {plan.startDate && plan.endDate
                    ? `${plan.startDate} ~ ${plan.endDate}`
                    : "未设置时间"}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
