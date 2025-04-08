import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { priceId, coupon } = body;

    console.log("💳 Received priceId:", priceId);
    console.log("🏷️ Received coupon:", coupon || "None");

    if (!priceId) {
      return new Response(JSON.stringify({ error: "Missing priceId" }), {
        status: 400,
      });
    }

    const sessionParams = {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
    };

    // Optional coupon support
    if (coupon && coupon.trim() !== "") {
      sessionParams.discounts = [{ coupon: "W0pLJxc1" }];
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
    });

  } catch (error) {
    console.error("❌ STRIPE ERROR:", error);

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
