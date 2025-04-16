"use server";

import db from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateAIInsights } from "./dashboard";

export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Try finding user in DB
  let user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { industry: true },
  });

  // 🧠 If user doesn't exist in DB, create them using Clerk
  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error("Clerk user object not found");

    user = await db.user.create({
      data: {
        clerkUserId: userId,
        name: `${clerkUser.firstName ?? "New"} ${clerkUser.lastName ?? "User"}`,
        email: clerkUser.emailAddresses?.[0]?.emailAddress ?? `${userId}@example.com`,
        imageUrl: clerkUser.imageUrl ?? "",
        industry: "",
        experience: 0,
        skills: [],
        bio: "",
      },
    });
  }

  return {
    isOnboarded: !!user.industry,
  };
}

export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const result = await db.$transaction(async (tx) => {
      let industryInsight = await tx.industryInsight.findUnique({
        where: { industry: data.industry },
      });

      if (!industryInsight) {
        const insights = await generateAIInsights(data.industry);
        industryInsight = await tx.industryInsight.create({
          data: {
            industry: data.industry,
            ...insights,
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });
      }

      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          industry: data.industry,
          experience: data.experience,
          bio: data.bio,
          skills: data.skills,
        },
      });

      return { updatedUser, industryInsight };
    });

    revalidatePath("/");
    return result.updatedUser;
  } catch (error) {
    console.error("Error updating user and industry:", error.message);
    throw new Error("Failed to update profile");
  }
}
