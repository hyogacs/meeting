"use server";

import { db } from "@/db";
import { resources } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function createResource(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const id = crypto.randomUUID();
  const tags = (formData.get("tags") as string)
    ?.split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  await db.insert(resources).values({
    id,
    title: formData.get("title") as string,
    url: formData.get("url") as string,
    type: formData.get("type") as
      | "paper"
      | "tutorial"
      | "video"
      | "repo"
      | "tool"
      | "other",
    tags: tags.length > 0 ? JSON.stringify(tags) : null,
    description: formData.get("description") as string,
    planId: (formData.get("planId") as string) || null,
    addedBy: session.user.id,
  });

  revalidatePath("/resources");
}

export async function deleteResource(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.delete(resources).where(eq(resources.id, id));

  revalidatePath("/resources");
}

export async function getResources() {
  return db.query.resources.findMany({
    orderBy: (r, { desc }) => [desc(r.createdAt)],
  });
}

export async function saveResourceAiSummary(id: string, summary: string) {
  await db
    .update(resources)
    .set({ aiSummary: summary })
    .where(eq(resources.id, id));

  revalidatePath("/resources");
}
