# AI 学习小团队管理系统 — 概要设计

## 1. 项目背景

一个 **4 人 AI 学习小组**的内部管理系统，用于组织学习计划、记录分享会、沉淀学习资料，并借助 AI 能力提升学习效率。

### 设计原则

- **极简优先** — 4 人团队，拒绝过度工程，能用一张表解决的不拆两张
- **全栈统一** — 前后端同一语言（TypeScript），降低心智负担
- **AI 原生** — AI 不是附加功能，而是贯穿学习流程的核心能力
- **零运维** — SQLite + 单容器部署，无需维护数据库服务器

---

## 2. 技术选型

```
框架:     Next.js 15 (App Router) — 全栈框架，前后端一体
语言:     TypeScript — 类型安全，Java 背景成员容易上手
样式:     Tailwind CSS v4 + shadcn/ui — 现代 UI 组件库，开箱即用
ORM:      Drizzle ORM — 轻量、类型安全、SQL-like 写法
数据库:   SQLite (本地开发) / Turso (生产环境，可选)
认证:     NextAuth.js v5 — GitHub OAuth 登录（开发者友好）
AI:       Claude API (Anthropic) — 会议总结、资源推荐、智能问答
部署:     Vercel (推荐) 或 Docker 自部署
```

### 为什么选这套技术栈？

| 选择 | 理由 |
|------|------|
| **Next.js** | 2026 最主流全栈框架，不需要单独写后端 API 服务 |
| **TypeScript** | Java 开发者熟悉的强类型体验，迁移成本低 |
| **Drizzle ORM** | 比 Prisma 更轻量，SQL-like API 对有数据库经验的人更直觉 |
| **SQLite** | 4 人团队完全够用，零配置，单文件数据库，随时可迁移到 PostgreSQL |
| **shadcn/ui** | 不是 npm 包而是代码拷贝，完全可控可定制 |
| **GitHub OAuth** | 团队本身就用 GitHub，一键登录，无需密码管理 |

---

## 3. 功能模块

### 3.1 Dashboard（仪表盘）

首页总览，一目了然：

- 当前进行中的学习计划及进度
- 最近一次 / 下一次分享会信息
- 团队成员最新动态（提交笔记、完成任务等）
- AI 推荐的本周学习内容

### 3.2 Study Plans（学习计划）

管理团队的学习主题和任务：

```
学习计划示例：
┌─────────────────────────────────────────┐
│ 📖 Transformer 架构精读                    │
│ 状态: 进行中  |  周期: 2026.02 - 2026.03   │
├─────────────────────────────────────────┤
│ 任务列表:                                  │
│ ✅ 阅读 "Attention is All You Need"       │
│ 🔄 实现 Multi-Head Attention             │
│ ⬜ 阅读 "BERT: Pre-training..."          │
│ ⬜ 组内分享: Vision Transformer           │
└─────────────────────────────────────────┘
```

- 创建学习计划（标题、描述、时间周期）
- 拆分为具体任务，分配给成员
- 任务状态追踪（待开始 / 进行中 / 已完成）
- 成员可提交学习笔记（Markdown）

### 3.3 Meetings（分享会）

管理组内分享和讨论会：

- 排期日历视图
- 指定主讲人
- 会议记录编辑器（Markdown，支持实时协作）
- 附件上传（PPT、PDF、代码等）
- 录屏链接关联
- **AI 功能**: 上传会议录音/文字 → 自动生成结构化会议纪要

### 3.4 Resources（资源库）

团队共享的学习资料仓库：

- 资源类型：论文 / 教程 / 视频 / 代码仓库 / 工具
- 标签分类系统
- GitHub 仓库关联 — 直接从 GitHub 导入 star 的仓库
- 一键生成资源摘要（AI）
- 成员推荐和评分

### 3.5 AI Assistant（AI 助手）

贯穿全系统的 AI 能力：

| 功能 | 说明 |
|------|------|
| **会议纪要生成** | 上传文字/录音 → 自动提取要点、行动项、决议 |
| **学习资源摘要** | 粘贴论文链接 → 自动生成中文摘要和关键要点 |
| **知识问答** | 基于团队已沉淀的资料进行 RAG 问答 |
| **学习路径推荐** | 根据团队当前进度，推荐下一步学习内容 |
| **笔记润色** | 帮助成员优化学习笔记的结构和表达 |

### 3.6 GitHub Integration（GitHub 集成）

与团队的 GitHub 组织/仓库联动：

- GitHub OAuth 登录
- 关联学习相关的 GitHub 仓库
- 自动同步仓库的 README 作为资源描述
- 学习计划中的代码任务可关联到具体 Issue/PR
- 展示团队成员的学习相关代码提交活动

---

## 4. 数据模型

精简设计，4 张核心表 + 3 张关联表：

```sql
-- 用户（通过 GitHub OAuth，几乎不需要额外字段）
users
├── id            TEXT PRIMARY KEY
├── github_id     TEXT UNIQUE
├── name          TEXT
├── email         TEXT
├── avatar_url    TEXT
├── role          TEXT DEFAULT 'member'  -- 'admin' | 'member'
└── created_at    TIMESTAMP

-- 学习计划
study_plans
├── id            TEXT PRIMARY KEY
├── title         TEXT NOT NULL
├── description   TEXT
├── status        TEXT DEFAULT 'active'  -- 'draft' | 'active' | 'completed' | 'archived'
├── start_date    DATE
├── end_date      DATE
├── created_by    TEXT REFERENCES users(id)
└── created_at    TIMESTAMP

-- 任务（属于某个学习计划）
tasks
├── id            TEXT PRIMARY KEY
├── plan_id       TEXT REFERENCES study_plans(id)
├── title         TEXT NOT NULL
├── description   TEXT
├── assignee_id   TEXT REFERENCES users(id)
├── status        TEXT DEFAULT 'todo'  -- 'todo' | 'in_progress' | 'done'
├── due_date      DATE
├── note          TEXT                 -- 学习笔记 (Markdown)
├── sort_order    INTEGER
└── created_at    TIMESTAMP

-- 分享会 / 会议
meetings
├── id            TEXT PRIMARY KEY
├── plan_id       TEXT REFERENCES study_plans(id)  -- 可选关联
├── title         TEXT NOT NULL
├── description   TEXT
├── scheduled_at  TIMESTAMP
├── presenter_id  TEXT REFERENCES users(id)
├── notes         TEXT                 -- 会议记录 (Markdown)
├── recording_url TEXT
├── ai_summary    TEXT                 -- AI 生成的摘要
└── created_at    TIMESTAMP

-- 学习资源
resources
├── id            TEXT PRIMARY KEY
├── title         TEXT NOT NULL
├── url           TEXT
├── type          TEXT  -- 'paper' | 'tutorial' | 'video' | 'repo' | 'tool' | 'other'
├── tags          TEXT  -- JSON array: ["transformer", "attention", "nlp"]
├── description   TEXT
├── ai_summary    TEXT  -- AI 生成的摘要
├── plan_id       TEXT REFERENCES study_plans(id)  -- 可选关联
├── added_by      TEXT REFERENCES users(id)
└── created_at    TIMESTAMP

-- 评论（通用，可挂在任务/会议/资源下）
comments
├── id            TEXT PRIMARY KEY
├── target_type   TEXT  -- 'task' | 'meeting' | 'resource'
├── target_id     TEXT
├── author_id     TEXT REFERENCES users(id)
├── content       TEXT
└── created_at    TIMESTAMP

-- GitHub 仓库关联
github_repos
├── id            TEXT PRIMARY KEY
├── repo_full_name TEXT  -- e.g. "hyogacs/meeting"
├── description   TEXT
├── url           TEXT
├── plan_id       TEXT REFERENCES study_plans(id)  -- 可选关联
├── synced_at     TIMESTAMP
└── added_by      TEXT REFERENCES users(id)
```

---

## 5. 项目目录结构

```
meeting/
├── CLAUDE.md                     # AI 助手开发指南
├── docs/
│   └── DESIGN.md                 # 本文件 — 概要设计
├── package.json
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── drizzle.config.ts             # Drizzle ORM 配置
├── .env.local                    # 环境变量 (不提交)
│
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # 根布局
│   │   ├── page.tsx              # Dashboard 首页
│   │   ├── plans/                # 学习计划页面
│   │   │   ├── page.tsx          # 计划列表
│   │   │   └── [id]/page.tsx     # 计划详情
│   │   ├── meetings/             # 分享会页面
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── resources/            # 资源库页面
│   │   │   └── page.tsx
│   │   ├── ai/                   # AI 助手页面
│   │   │   └── page.tsx
│   │   └── api/                  # API 路由 (Server Actions 优先)
│   │       ├── auth/[...nextauth]/route.ts
│   │       └── ai/
│   │           ├── summarize/route.ts
│   │           └── chat/route.ts
│   │
│   ├── components/               # UI 组件
│   │   ├── ui/                   # shadcn/ui 基础组件
│   │   ├── layout/               # Header, Sidebar, Footer
│   │   ├── plans/                # 学习计划相关组件
│   │   ├── meetings/             # 会议相关组件
│   │   ├── resources/            # 资源相关组件
│   │   └── ai/                   # AI 助手相关组件
│   │
│   ├── db/
│   │   ├── schema.ts             # Drizzle 数据库 Schema
│   │   ├── index.ts              # 数据库连接
│   │   └── migrations/           # 数据库迁移文件
│   │
│   ├── lib/
│   │   ├── auth.ts               # NextAuth 配置
│   │   ├── ai.ts                 # Claude API 封装
│   │   ├── github.ts             # GitHub API 封装
│   │   └── utils.ts              # 工具函数
│   │
│   ├── actions/                  # Server Actions
│   │   ├── plans.ts
│   │   ├── tasks.ts
│   │   ├── meetings.ts
│   │   └── resources.ts
│   │
│   └── types/                    # TypeScript 类型定义
│       └── index.ts
│
├── public/                       # 静态资源
└── data/
    └── meeting.db                # SQLite 数据库文件 (不提交)
```

---

## 6. 页面与路由

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | Dashboard | 仪表盘总览 |
| `/plans` | 学习计划列表 | 所有计划卡片视图 |
| `/plans/new` | 创建计划 | 表单 |
| `/plans/[id]` | 计划详情 | 任务列表、进度、笔记 |
| `/meetings` | 分享会列表 | 日历 + 列表视图 |
| `/meetings/[id]` | 会议详情 | 记录、附件、AI 摘要 |
| `/resources` | 资源库 | 筛选、搜索、标签 |
| `/ai` | AI 助手 | 对话式交互 |
| `/settings` | 设置 | GitHub 集成、个人偏好 |

---

## 7. AI 功能详细设计

### 7.1 会议纪要生成

```
输入: 会议的文字记录（手动粘贴或语音转文字）
处理: Claude API → 提取结构化信息
输出:
  - 📋 讨论要点（3-5 条）
  - ✅ 行动项（谁、做什么、截止时间）
  - 💡 关键决议
  - ❓ 待解决问题
```

### 7.2 学习资源摘要

```
输入: 论文/文章 URL 或粘贴的文本
处理: 抓取内容 → Claude API 分析
输出:
  - 一句话概括
  - 核心观点（3-5 条）
  - 与当前学习计划的关联度评估
  - 推荐阅读优先级
```

### 7.3 知识问答 (RAG)

```
输入: 用户问题（如 "Transformer 的自注意力机制和 RNN 的区别？"）
处理:
  1. 检索团队已有的学习笔记、会议记录、资源摘要
  2. 构建上下文 → Claude API 回答
  3. 引用来源标注
输出: 基于团队知识库的回答 + 引用来源
```

### 7.4 学习路径推荐

```
输入: 当前学习计划的完成情况
处理: 分析团队进度 → Claude API 推荐
输出:
  - 推荐下一步学习的主题
  - 推荐的学习资源
  - 建议的任务分配
```

---

## 8. GitHub 集成详细设计

### 8.1 认证

- 使用 NextAuth.js 的 GitHub Provider
- OAuth scope: `read:user`, `user:email`, `repo` (读取仓库信息)
- 登录后自动获取用户头像、用户名

### 8.2 仓库关联

- 可以搜索并关联用户有权限的 GitHub 仓库
- 自动同步仓库的 README、描述、语言等信息
- 关联到具体的学习计划

### 8.3 活动追踪

- 展示团队成员在关联仓库的近期提交
- 学习计划中的代码任务可链接到 Issue 或 PR

---

## 9. 开发路线图

### Phase 0 — 项目骨架 (Day 1-2)

- [x] 概要设计文档
- [ ] 初始化 Next.js 项目
- [ ] 配置 Tailwind + shadcn/ui
- [ ] 配置 Drizzle ORM + SQLite
- [ ] 实现 GitHub OAuth 登录
- [ ] 基础布局（Sidebar + Header）

### Phase 1 — 核心功能 (Day 3-7)

- [ ] 学习计划 CRUD
- [ ] 任务管理（创建、分配、状态更新）
- [ ] 学习笔记编辑器（Markdown）
- [ ] 分享会管理
- [ ] Dashboard 仪表盘

### Phase 2 — AI 集成 (Day 8-10)

- [ ] Claude API 集成
- [ ] 会议纪要自动生成
- [ ] 学习资源摘要
- [ ] AI 对话助手页面

### Phase 3 — 扩展功能 (Day 11-14)

- [ ] 资源库 + 标签系统
- [ ] GitHub 仓库关联
- [ ] 知识问答 (RAG)
- [ ] 学习路径推荐

### Phase 4 — 打磨 (Day 15+)

- [ ] 响应式适配（移动端）
- [ ] 数据导出
- [ ] 进度可视化图表
- [ ] 通知功能（可选）

---

## 10. 环境变量

```env
# 数据库
DATABASE_URL=file:./data/meeting.db

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Claude API
ANTHROPIC_API_KEY=your-anthropic-api-key
```

---

## 11. 快速启动（预期）

```bash
# 安装依赖
pnpm install

# 初始化数据库
pnpm db:push

# 启动开发服务器
pnpm dev

# 打开浏览器
open http://localhost:3000
```
