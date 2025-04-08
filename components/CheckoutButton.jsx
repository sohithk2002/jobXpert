"use client";

export default function CheckoutButton() {
  const handleCheckout = async () => {
    const res = await fetch("/api/stripe", {
      method: "POST",
      body: JSON.stringify({ priceId: "price_1R9GRLIhvhRtXRWIx1Gd4APv" }), // Replace with your real Stripe price ID
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Checkout failed");
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
    >
      Buy Now
    </button>
  );
}
