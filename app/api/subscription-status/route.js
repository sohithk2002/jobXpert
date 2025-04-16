import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return new Response(
        JSON.stringify({ plan: "Free", status: "inactive", renews_at: null }),
        { status: 200 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user || !user.stripeCustomerId) {
      return new Response(
        JSON.stringify({ plan: "Free", status: "inactive", renews_at: null }),
        { status: 200 }
      );
    }

    // Optional: fetch live status from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: "all",
    });

    const activeSub = subscriptions.data.find(
      (sub) => sub.status === "active" || sub.status === "trialing"
    );

    if (!activeSub) {
      return new Response(
        JSON.stringify({ plan: "Free", status: "inactive", renews_at: null }),
        { status: 200 }
      );
    }

    const renewsAt = new Date(activeSub.current_period_end * 1000);

    // Optional DB sync
    await prisma.user.update({
      where: { clerkUserId: userId },
      data: {
        plan: "Pro",
        subscriptionStatus: activeSub.status,
        endsAt: renewsAt,
      },
    });

    return new Response(
      JSON.stringify({
        plan: "Pro",
        status: activeSub.status,
        renews_at: renewsAt.toLocaleDateString(),
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
