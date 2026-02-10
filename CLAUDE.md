# AI 学习小团队管理系统

## 项目概述

4 人 AI 学习小组的内部管理系统。管理学习计划、分享会、资源库，集成 AI 助手和 GitHub。

## 技术栈

- **框架**: Next.js 16 (App Router) + TypeScript
- **样式**: Tailwind CSS v4
- **数据库**: SQLite (better-sqlite3) + Drizzle ORM
- **认证**: NextAuth.js v5 beta (GitHub OAuth)
- **AI**: Claude API (@anthropic-ai/sdk)
- **图标**: lucide-react
- **包管理**: pnpm

## 开发命令

```bash
pnpm install        # 安装依赖
pnpm dev            # 启动开发服务器 (localhost:3000)
pnpm build          # 构建生产版本
pnpm lint           # ESLint 检查
pnpm db:push        # 同步数据库 Schema 到 SQLite
pnpm db:generate    # 生成数据库迁移
pnpm db:studio      # 打开 Drizzle Studio (数据库管理界面)
```

## 项目结构

```
src/
├── app/                 # Next.js App Router 页面
│   ├── page.tsx         # Dashboard 首页
│   ├── plans/           # 学习计划
│   ├── meetings/        # 分享会
│   ├── resources/       # 资源库
│   ├── ai/              # AI 助手
│   ├── settings/        # 设置
│   └── api/             # API 路由 (auth, ai, meetings)
├── actions/             # Server Actions (plans, tasks, meetings, resources)
├── components/
│   ├── layout/          # Sidebar, Header
│   ├── plans/           # 学习计划组件
│   ├── meetings/        # 会议组件
│   ├── resources/       # 资源组件
│   └── ai/              # AI 聊天组件
├── db/
│   ├── schema.ts        # Drizzle 数据库 Schema (所有表定义)
│   └── index.ts         # 数据库连接
├── lib/
│   ├── auth.ts          # NextAuth 配置
│   ├── ai.ts            # Claude API 封装
│   ├── github.ts        # GitHub API 封装
│   └── utils.ts         # cn() 等工具函数
└── types/index.ts       # TypeScript 类型推断
```

## 环境变量

需要在 `.env.local` 中配置:
- `NEXTAUTH_SECRET` — NextAuth 密钥
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` — GitHub OAuth
- `ANTHROPIC_API_KEY` — Claude API 密钥

## 开发约定

- 优先使用 Server Actions (`src/actions/`)，而非 API Route
- 数据库操作通过 Drizzle ORM，不写原生 SQL
- 样式使用 Tailwind CSS utility classes
- 所有 AI 调用封装在 `src/lib/ai.ts`
- GitHub 相关操作封装在 `src/lib/github.ts`
- 数据库文件存储在 `data/meeting.db`，不提交到 git

## 设计文档

详细设计见 [docs/DESIGN.md](docs/DESIGN.md)
