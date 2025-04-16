import Stripe from "stripe";
console.log("✅ Success URL:", `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return new Response(JSON.stringify({ error: "Invalid content type" }), {
        status: 400,
      });
    }

    const body = await req.json();
    const { priceId, coupon } = body;

    console.log("📦 STRIPE BODY:", body);
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

    if (coupon?.trim()) {
      sessionParams.discounts = [{ coupon }];
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
