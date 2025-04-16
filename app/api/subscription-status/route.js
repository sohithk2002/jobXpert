import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = auth();

    // 👇 If not logged in, return default values
    if (!userId) {
      return new Response(
        JSON.stringify({
          plan: "Free",
          status: "inactive",
          renews_at: null,
        }),
        { status: 200 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    return new Response(
      JSON.stringify({
        plan: user?.plan || "Free",
        status: user?.subscriptionStatus || "inactive",
        renews_at: user?.endsAt
          ? new Date(user.endsAt).toLocaleDateString()
          : null,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("💥 Subscription status error:", error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
