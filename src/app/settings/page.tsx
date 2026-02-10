import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { Settings } from "lucide-react";

export default async function SettingsPage() {
  const session = await auth();
  const allUsers = await db.select().from(users);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">设置</h1>
        <p className="mt-1 text-sm text-gray-500">系统设置和团队管理</p>
      </div>

      {/* Current User */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">当前用户</h2>
        {session?.user ? (
          <div className="flex items-center gap-4">
            {session.user.image && (
              <img
                src={session.user.image}
                alt=""
                className="h-12 w-12 rounded-full"
              />
            )}
            <div>
              <p className="font-medium text-gray-900">{session.user.name}</p>
              <p className="text-sm text-gray-500">{session.user.email}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">未登录</p>
        )}
      </div>

      {/* Team Members */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          团队成员 ({allUsers.length})
        </h2>
        {allUsers.length === 0 ? (
          <div className="text-center py-8">
            <Settings className="mx-auto h-10 w-10 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              还没有成员，通过 GitHub 登录后自动加入
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {allUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 p-3"
              >
                <div className="flex items-center gap-3">
                  {user.avatarUrl && (
                    <img
                      src={user.avatarUrl}
                      alt=""
                      className="h-8 w-8 rounded-full"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Environment */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">环境配置</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">GitHub OAuth</span>
            <span
              className={
                process.env.GITHUB_CLIENT_ID
                  ? "text-green-600"
                  : "text-red-500"
              }
            >
              {process.env.GITHUB_CLIENT_ID ? "已配置" : "未配置"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Claude API</span>
            <span
              className={
                process.env.ANTHROPIC_API_KEY
                  ? "text-green-600"
                  : "text-red-500"
              }
            >
              {process.env.ANTHROPIC_API_KEY ? "已配置" : "未配置"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
