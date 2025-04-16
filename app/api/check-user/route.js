import { currentUser } from "@clerk/nextjs/server";
import db from "@/lib/prisma";

export async function GET() {
  const user = await currentUser();

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  // Check by Clerk ID first
  const existingUser = await db.user.findUnique({
    where: { clerkUserId: user.id },
  });

  if (existingUser) {
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }

  // Also check if a user with the same email exists already (just in case)
  const userByEmail = await db.user.findUnique({
    where: { email: user.emailAddresses[0].emailAddress },
  });

  if (userByEmail) {
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }

  // Create user only if truly not found
  try {
    await db.user.create({
      data: {
        clerkUserId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.emailAddresses[0].emailAddress,
        imageUrl: user.imageUrl,
        plan: "pro",
      },
    });

    return new Response(JSON.stringify({ ok: true, created: true }), { status: 201 });
  } catch (err) {
    console.error("🔥 Error creating user:", err);
    return new Response(JSON.stringify({ error: "Failed to create user" }), { status: 500 });
  }
}
