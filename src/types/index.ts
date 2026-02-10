import type { InferSelectModel } from "drizzle-orm";
import type {
  users,
  studyPlans,
  tasks,
  meetings,
  resources,
  comments,
  githubRepos,
} from "@/db/schema";

export type User = InferSelectModel<typeof users>;
export type StudyPlan = InferSelectModel<typeof studyPlans>;
export type Task = InferSelectModel<typeof tasks>;
export type Meeting = InferSelectModel<typeof meetings>;
export type Resource = InferSelectModel<typeof resources>;
export type Comment = InferSelectModel<typeof comments>;
export type GitHubRepo = InferSelectModel<typeof githubRepos>;

export type StudyPlanWithTasks = StudyPlan & { tasks: Task[] };
export type MeetingWithPresenter = Meeting & { presenter: User | null };
export type TaskWithAssignee = Task & { assignee: User | null };
