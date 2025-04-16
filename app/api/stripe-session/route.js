import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const session_id = searchParams.get("session_id");

  if (!session_id) {
    return new Response("Missing session_id", { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["customer", "subscription"],
    });

    const customer = session.customer;
    const subscription = session.subscription;
    const email = customer?.email;
    const endsAtTimestamp = subscription?.current_period_end;

    // ✅ Fallback: 30 days if endsAt is null (in case of trial without end date)
    const fallbackEndsAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const endsAt = endsAtTimestamp ? new Date(endsAtTimestamp * 1000) : fallbackEndsAt;

    if (!customer || !subscription || !email) {
      console.error("❌ Missing session data:", {
        customer,
        subscription,
        email,
        endsAtTimestamp,
      });
      return new Response("Incomplete session data", { status: 400 });
    }

    // ✅ Update user in DB using email
    await prisma.user.updateMany({
      where: { email },
      data: {
        stripeCustomerId: customer.id,
        subscriptionStatus: subscription.status,
        plan: "Pro",
        endsAt,
      },
    });

    return new Response(JSON.stringify(session), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Stripe session error:", err);
    return new Response("Failed to retrieve session", { status: 500 });
  }
}
