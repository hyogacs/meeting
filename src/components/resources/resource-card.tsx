"use client";

import type { Resource } from "@/types";
import { deleteResource } from "@/actions/resources";
import {
  FileText,
  Video,
  BookOpen,
  GitBranch,
  Wrench,
  File,
  ExternalLink,
  Trash2,
  Bot,
} from "lucide-react";
import { useState } from "react";

const typeConfig: Record<
  string,
  { icon: typeof FileText; color: string; label: string }
> = {
  paper: { icon: FileText, color: "text-red-500", label: "论文" },
  tutorial: { icon: BookOpen, color: "text-blue-500", label: "教程" },
  video: { icon: Video, color: "text-purple-500", label: "视频" },
  repo: { icon: GitBranch, color: "text-green-500", label: "仓库" },
  tool: { icon: Wrench, color: "text-orange-500", label: "工具" },
  other: { icon: File, color: "text-gray-500", label: "其他" },
};

export function ResourceCard({ resource }: { resource: Resource }) {
  const [showSummary, setShowSummary] = useState(false);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(resource.aiSummary || "");

  const config = typeConfig[resource.type] || typeConfig.other;
  const Icon = config.icon;
  const tags: string[] = resource.tags ? JSON.parse(resource.tags) : [];

  const handleAiSummary = async () => {
    if (summary) {
      setShowSummary(!showSummary);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/ai/summarize-resource", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resourceId: resource.id,
          title: resource.title,
          description: resource.description || "",
          url: resource.url || "",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSummary(data.summary);
        setShowSummary(true);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Icon className={`mt-0.5 h-5 w-5 ${config.color}`} />
          <div>
            <h3 className="font-semibold text-gray-900">{resource.title}</h3>
            <span className="text-xs text-gray-400">{config.label}</span>
          </div>
        </div>
        <button
          onClick={() => deleteResource(resource.id)}
          className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {resource.description && (
        <p className="mt-2 text-sm text-gray-500">{resource.description}</p>
      )}

      {resource.url && (
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          打开链接
        </a>
      )}

      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 border-t border-gray-100 pt-3">
        <button
          onClick={handleAiSummary}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-800 disabled:opacity-50"
        >
          <Bot className="h-3.5 w-3.5" />
          {loading ? "生成中..." : summary ? "查看 AI 摘要" : "AI 生成摘要"}
        </button>
        {showSummary && summary && (
          <div className="mt-2 rounded-md bg-purple-50 p-3 text-sm text-gray-600">
            <p className="whitespace-pre-wrap">{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
}
