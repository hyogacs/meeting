# AI 学习小团队管理系统

## 项目概述

4 人 AI 学习小组的内部管理系统。管理学习计划、分享会、资源库，集成 AI 助手和 GitHub。

## 技术栈

- **框架**: Next.js 15 (App Router) + TypeScript
- **样式**: Tailwind CSS v4 + shadcn/ui
- **数据库**: SQLite + Drizzle ORM
- **认证**: NextAuth.js v5 (GitHub OAuth)
- **AI**: Claude API (Anthropic)
- **包管理**: pnpm

## 开发命令

```bash
pnpm install        # 安装依赖
pnpm dev            # 启动开发服务器 (localhost:3000)
pnpm build          # 构建生产版本
pnpm db:push        # 同步数据库 Schema
pnpm db:studio      # 打开 Drizzle Studio (数据库管理界面)
```

## 项目结构

```
src/
├── app/            # Next.js 页面和 API 路由
├── components/     # React 组件 (ui/ 为 shadcn 组件)
├── db/             # 数据库 Schema 和连接
├── lib/            # 工具库 (auth, ai, github)
├── actions/        # Server Actions
└── types/          # TypeScript 类型
```

## 开发约定

- 优先使用 Server Actions，而非 API Route
- 数据库操作通过 Drizzle ORM，不写原生 SQL
- 组件使用 shadcn/ui，自定义组件放 components/ 下
- 所有 AI 调用封装在 `src/lib/ai.ts`
- GitHub 相关操作封装在 `src/lib/github.ts`

## 设计文档

详细设计见 [docs/DESIGN.md](docs/DESIGN.md)
