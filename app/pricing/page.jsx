"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [coupon, setCoupon] = useState("");

  const handleCheckout = async () => {
    if (!selectedPlan) {
      alert("Please select a plan before continuing.");
      return;
    }

    const priceId =
      selectedPlan === "trial"
        ? "price_1R9HEEIhvhRtXRWIKzabMmAM" // Replace this
        : "price_1R9GRLIhvhRtXRWIx1Gd4APv"; // Replace this

    const res = await fetch("/api/stripe", {
      method: "POST",
      body: JSON.stringify({
        priceId,
        coupon,
      }),
    });

    const data = await res.json();

    if (data?.url) {
      window.location.href = data.url; // ✅ Redirect to Stripe
    } else {
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Choose Your Plan</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full">
        {/* $5/month plan */}
        <Card
          className={`cursor-pointer ${
            selectedPlan === "paid" ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => setSelectedPlan("paid")}
        >
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Pro — $5/month</h2>
            <p className="text-sm text-muted-foreground">
              Full access to all premium features.
            </p>
          </CardContent>
        </Card>

        {/* 3-Day Free Trial */}
        <Card
          className={`cursor-pointer ${
            selectedPlan === "trial" ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => setSelectedPlan("trial")}
        >
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Free Trial — 3 Days</h2>
            <p className="text-sm text-muted-foreground">
              Try everything out before you pay.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Coupon Field */}
      <input
        type="text"
        placeholder="Enter coupon code (optional)"
        value={coupon}
        onChange={(e) => setCoupon(e.target.value)}
        className="mt-6 px-4 py-2 border border-input rounded-md w-full max-w-sm bg-background text-foreground"
      />

      <Button className="mt-4" onClick={handleCheckout}>
        Continue to Checkout
      </Button>
    </div>
  );
}
