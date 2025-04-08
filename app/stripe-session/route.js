import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const session_id = searchParams.get("session_id");

  if (!session_id) {
    return new Response("Missing session_id", { status: 400 });
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["customer", "subscription"],
  });

  return new Response(JSON.stringify(session), { status: 200 });
}
