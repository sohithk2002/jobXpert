// app/api/check-user/route.js
import { currentUser } from "@clerk/nextjs/server";
import db from "@/lib/prisma";

export async function GET() {
  const user = await currentUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const existingUser = await db.user.findFirst({
    where: {
      OR: [
        { clerkUserId: user.id },
        { email: user.emailAddresses[0].emailAddress },
      ],
    },
  });

  if (existingUser) {
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
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
}
