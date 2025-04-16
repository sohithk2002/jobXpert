// /app/api/check-user/route.js
import { currentUser } from "@clerk/nextjs/server";
import db from "@/lib/prisma";

export async function GET() {
  const user = await currentUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const email = user.emailAddresses?.[0]?.emailAddress;

  // Find user by Clerk ID or email
  let existingUser = await db.user.findFirst({
    where: {
      OR: [
        { clerkUserId: user.id },
        { email: email },
      ],
    },
  });

  // 🧠 If user already exists
  if (existingUser) {
    // Optional: If the plan is still free, but the session came from a Stripe payment page,
    // you can upgrade the plan here to pro — up to your app logic
    if (existingUser.plan !== "pro") {
      await db.user.update({
        where: { id: existingUser.id },
        data: { plan: "pro" }, // Auto-upgrade logic after payment
      });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }

  // 🚀 Create new user (usually after first payment)
  const newUser = await db.user.create({
    data: {
      clerkUserId: user.id,
      name: `${user.firstName ?? "New"} ${user.lastName ?? "User"}`,
      email: email ?? `${user.id}@example.com`,
      imageUrl: user.imageUrl ?? "",
      plan: "pro", // Default to pro since it’s coming after payment
    },
  });

  return new Response(JSON.stringify({ ok: true, created: true }), { status: 201 });
}
