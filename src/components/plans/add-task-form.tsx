"use client";

import { useState } from "react";
import { createTask } from "@/actions/tasks";
import { Plus } from "lucide-react";

export function AddTaskForm({ planId }: { planId: string }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600"
      >
        <Plus className="h-4 w-4" />
        添加任务
      </button>
    );
  }

  return (
    <form
      action={async (formData) => {
        await createTask(planId, formData);
        setIsOpen(false);
      }}
      className="mb-4 rounded-lg border border-gray-200 bg-white p-4"
    >
      <div className="space-y-3">
        <input
          name="title"
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          placeholder="任务标题"
          autoFocus
        />
        <input
          name="description"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          placeholder="描述（可选）"
        />
        <input
          name="dueDate"
          type="date"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          添加
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="rounded-md px-4 py-2 text-sm text-gray-500 hover:bg-gray-100"
        >
          取消
        </button>
      </div>
    </form>
  );
}
