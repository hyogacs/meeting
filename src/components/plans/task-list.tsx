"use client";

import { updateTaskStatus, deleteTask, updateTaskNote } from "@/actions/tasks";
import { useState } from "react";
import type { Task } from "@/types";
import { CheckCircle2, Circle, Clock, Trash2, FileText, X } from "lucide-react";

const statusConfig = {
  todo: { icon: Circle, color: "text-gray-400", label: "待开始" },
  in_progress: { icon: Clock, color: "text-blue-500", label: "进行中" },
  done: { icon: CheckCircle2, color: "text-green-500", label: "已完成" },
};

const nextStatus: Record<string, "todo" | "in_progress" | "done"> = {
  todo: "in_progress",
  in_progress: "done",
  done: "todo",
};

export function TaskList({ tasks }: { tasks: Task[] }) {
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");

  if (tasks.length === 0) {
    return (
      <p className="mt-4 text-sm text-gray-500">
        还没有任务，添加第一个任务吧
      </p>
    );
  }

  return (
    <div className="mt-3 space-y-2">
      {tasks.map((task) => {
        const config = statusConfig[task.status];
        const Icon = config.icon;

        return (
          <div
            key={task.id}
            className="rounded-lg border border-gray-200 bg-white p-4"
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => updateTaskStatus(task.id, nextStatus[task.status])}
                className={`mt-0.5 ${config.color} hover:opacity-70`}
                title={`当前: ${config.label}，点击切换`}
              >
                <Icon className="h-5 w-5" />
              </button>
              <div className="flex-1">
                <p
                  className={`font-medium ${
                    task.status === "done"
                      ? "text-gray-400 line-through"
                      : "text-gray-900"
                  }`}
                >
                  {task.title}
                </p>
                {task.description && (
                  <p className="mt-0.5 text-sm text-gray-500">
                    {task.description}
                  </p>
                )}
                {task.dueDate && (
                  <p className="mt-1 text-xs text-gray-400">
                    截止: {task.dueDate}
                  </p>
                )}
                {task.note && editingNote !== task.id && (
                  <div className="mt-2 rounded-md bg-gray-50 p-3 text-sm text-gray-600">
                    <p className="mb-1 text-xs font-medium text-gray-400">
                      学习笔记
                    </p>
                    <p className="whitespace-pre-wrap">{task.note}</p>
                  </div>
                )}
                {editingNote === task.id && (
                  <div className="mt-2">
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      rows={4}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      placeholder="写下你的学习笔记..."
                    />
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={async () => {
                          await updateTaskNote(task.id, noteText);
                          setEditingNote(null);
                        }}
                        className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                      >
                        保存
                      </button>
                      <button
                        onClick={() => setEditingNote(null)}
                        className="rounded-md px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-100"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    if (editingNote === task.id) {
                      setEditingNote(null);
                    } else {
                      setNoteText(task.note || "");
                      setEditingNote(task.id);
                    }
                  }}
                  className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  title="编辑笔记"
                >
                  {editingNote === task.id ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                  title="删除任务"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
