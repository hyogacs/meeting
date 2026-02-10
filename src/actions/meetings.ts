"use server";

import { db } from "@/db";
import { meetings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function createMeeting(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const id = crypto.randomUUID();
  await db.insert(meetings).values({
    id,
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    scheduledAt: formData.get("scheduledAt") as string,
    presenterId: (formData.get("presenterId") as string) || null,
    planId: (formData.get("planId") as string) || null,
  });

  revalidatePath("/meetings");
  revalidatePath("/");
}

export async function updateMeeting(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db
    .update(meetings)
    .set({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      scheduledAt: formData.get("scheduledAt") as string,
      presenterId: (formData.get("presenterId") as string) || null,
      notes: formData.get("notes") as string,
      recordingUrl: formData.get("recordingUrl") as string,
    })
    .where(eq(meetings.id, id));

  revalidatePath(`/meetings/${id}`);
  revalidatePath("/meetings");
  revalidatePath("/");
}

export async function deleteMeeting(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.delete(meetings).where(eq(meetings.id, id));

  revalidatePath("/meetings");
  revalidatePath("/");
}

export async function getMeetings() {
  return db.query.meetings.findMany({
    orderBy: (m, { desc }) => [desc(m.scheduledAt)],
  });
}

export async function getMeeting(id: string) {
  return db.query.meetings.findFirst({
    where: eq(meetings.id, id),
  });
}

export async function saveMeetingAiSummary(id: string, summary: string) {
  await db
    .update(meetings)
    .set({ aiSummary: summary })
    .where(eq(meetings.id, id));

  revalidatePath(`/meetings/${id}`);
}
