import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  githubId: text("github_id").unique(),
  name: text("name").notNull(),
  email: text("email"),
  emailVerified: integer("email_verified", { mode: "timestamp" }),
  image: text("image"),
  avatarUrl: text("avatar_url"),
  role: text("role", { enum: ["admin", "member"] })
    .notNull()
    .default("member"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const studyPlans = sqliteTable("study_plans", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status", {
    enum: ["draft", "active", "completed", "archived"],
  })
    .notNull()
    .default("active"),
  startDate: text("start_date"),
  endDate: text("end_date"),
  createdBy: text("created_by").references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const tasks = sqliteTable("tasks", {
  id: text("id").primaryKey(),
  planId: text("plan_id")
    .notNull()
    .references(() => studyPlans.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  assigneeId: text("assignee_id").references(() => users.id),
  status: text("status", { enum: ["todo", "in_progress", "done"] })
    .notNull()
    .default("todo"),
  dueDate: text("due_date"),
  note: text("note"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const meetings = sqliteTable("meetings", {
  id: text("id").primaryKey(),
  planId: text("plan_id").references(() => studyPlans.id),
  title: text("title").notNull(),
  description: text("description"),
  scheduledAt: text("scheduled_at"),
  presenterId: text("presenter_id").references(() => users.id),
  notes: text("notes"),
  recordingUrl: text("recording_url"),
  aiSummary: text("ai_summary"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const resources = sqliteTable("resources", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url"),
  type: text("type", {
    enum: ["paper", "tutorial", "video", "repo", "tool", "other"],
  })
    .notNull()
    .default("other"),
  tags: text("tags"),
  description: text("description"),
  aiSummary: text("ai_summary"),
  planId: text("plan_id").references(() => studyPlans.id),
  addedBy: text("added_by").references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const comments = sqliteTable("comments", {
  id: text("id").primaryKey(),
  targetType: text("target_type", {
    enum: ["task", "meeting", "resource"],
  }).notNull(),
  targetId: text("target_id").notNull(),
  authorId: text("author_id")
    .notNull()
    .references(() => users.id),
  content: text("content").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const githubRepos = sqliteTable("github_repos", {
  id: text("id").primaryKey(),
  repoFullName: text("repo_full_name").notNull(),
  description: text("description"),
  url: text("url"),
  planId: text("plan_id").references(() => studyPlans.id),
  syncedAt: integer("synced_at", { mode: "timestamp" }),
  addedBy: text("added_by").references(() => users.id),
});

// NextAuth.js required tables — property names must be snake_case for adapter
export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
});

export const sessions = sqliteTable("sessions", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp" }).notNull(),
});

export const verificationTokens = sqliteTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: integer("expires", { mode: "timestamp" }).notNull(),
});
