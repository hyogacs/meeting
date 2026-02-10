"use server";

import { db } from "@/db";
import { studyPlans, tasks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function createPlan(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const id = crypto.randomUUID();
  await db.insert(studyPlans).values({
    id,
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    startDate: formData.get("startDate") as string,
    endDate: formData.get("endDate") as string,
    createdBy: session.user.id,
  });

  revalidatePath("/plans");
  revalidatePath("/");
}

export async function updatePlan(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db
    .update(studyPlans)
    .set({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as
        | "draft"
        | "active"
        | "completed"
        | "archived",
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
    })
    .where(eq(studyPlans.id, id));

  revalidatePath(`/plans/${id}`);
  revalidatePath("/plans");
  revalidatePath("/");
}

export async function deletePlan(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.delete(studyPlans).where(eq(studyPlans.id, id));

  revalidatePath("/plans");
  revalidatePath("/");
}

export async function getPlans() {
  return db.query.studyPlans.findMany({
    orderBy: (plans, { desc }) => [desc(plans.createdAt)],
  });
}

export async function getPlanWithTasks(id: string) {
  const plan = await db.query.studyPlans.findFirst({
    where: eq(studyPlans.id, id),
  });

  if (!plan) return null;

  const planTasks = await db.query.tasks.findMany({
    where: eq(tasks.planId, id),
    orderBy: (t, { asc }) => [asc(t.sortOrder)],
  });

  return { ...plan, tasks: planTasks };
}
