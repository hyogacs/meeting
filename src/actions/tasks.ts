"use server";

import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function createTask(planId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const id = crypto.randomUUID();
  await db.insert(tasks).values({
    id,
    planId,
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    assigneeId: (formData.get("assigneeId") as string) || null,
    dueDate: (formData.get("dueDate") as string) || null,
  });

  revalidatePath(`/plans/${planId}`);
}

export async function updateTaskStatus(
  taskId: string,
  status: "todo" | "in_progress" | "done"
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const task = await db.query.tasks.findFirst({
    where: eq(tasks.id, taskId),
  });

  if (!task) throw new Error("Task not found");

  await db.update(tasks).set({ status }).where(eq(tasks.id, taskId));

  revalidatePath(`/plans/${task.planId}`);
  revalidatePath("/");
}

export async function updateTaskNote(taskId: string, note: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const task = await db.query.tasks.findFirst({
    where: eq(tasks.id, taskId),
  });

  if (!task) throw new Error("Task not found");

  await db.update(tasks).set({ note }).where(eq(tasks.id, taskId));

  revalidatePath(`/plans/${task.planId}`);
}

export async function deleteTask(taskId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const task = await db.query.tasks.findFirst({
    where: eq(tasks.id, taskId),
  });

  if (!task) throw new Error("Task not found");

  await db.delete(tasks).where(eq(tasks.id, taskId));

  revalidatePath(`/plans/${task.planId}`);
}
