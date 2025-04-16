// app/api/check-user/route.js
import { currentUser } from "@clerk/nextjs/server";
import db from "@/lib/prisma";

export async function GET() {
  const user = await currentUser();

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    // Try to find the user by Clerk ID
    const existingUser = await db.user.findUnique({
      where: { clerkUserId: user.id },
    });

    if (existingUser) {
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    // ✅ Also check by email in case Clerk ID changed but email is same
    const userByEmail = await db.user.findUnique({
      where: { email: user.emailAddresses[0].emailAddress },
    });

    if (userByEmail) {
      return new Response(JSON.stringify({ ok: true, duplicateEmail: true }), { status: 200 });
    }

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
    return new Response(JSON.stringify({ error: "User creation failed" }), { status: 500 });
  }
}
