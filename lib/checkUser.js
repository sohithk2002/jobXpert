"use server";

import { currentUser } from "@clerk/nextjs/server";
import db from "@/lib/prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) return null;

  const clerkUserId = user.id;
  const email = user.emailAddresses[0]?.emailAddress;

  // 🔍 1. Try to find by Clerk ID
  let existingUser = await db.user.findUnique({
    where: { clerkUserId },
  });

  if (existingUser) return existingUser;

  // 🔍 2. If not found by Clerk ID, try to find by Email
  existingUser = await db.user.findUnique({
    where: { email },
  });

  // 🧠 If email exists but no Clerk ID, update it
  if (existingUser) {
    return await db.user.update({
      where: { email },
      data: { clerkUserId },
    });
  }

  // ✅ 3. Create new user
  const newUser = await db.user.create({
    data: {
      clerkUserId,
      email,
      name: `${user.firstName ?? ""} ${user.lastName ?? ""}`,
      imageUrl: user.imageUrl ?? "",
    },
  });

  return newUser;
};
