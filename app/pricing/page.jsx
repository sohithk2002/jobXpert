"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [coupon, setCoupon] = useState("");
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    async function fetchSubscription() {
      const res = await fetch("/api/subscription-status");
      const data = await res.json();
      setSubscription(data);
    }

    fetchSubscription();
  }, []);

  const handleCheckout = async () => {
    if (!selectedPlan) {
      alert("Please select a plan before continuing.");
      return;
    }
  
    const priceId =
      selectedPlan === "trial"
        ? "price_1R9HEEIhvhRtXRWIKzabMmAM"
        : "price_1R9GRLIhvhRtXRWIx1Gd4APv";
  
    const res = await fetch("/api/stripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // ✅ VERY IMPORTANT
      },
      body: JSON.stringify({
        priceId,
        coupon,
      }),
    });
  
    const data = await res.json();
  
    if (data?.url) {
      window.location.href = data.url;
    } else {
      alert("Something went wrong.");
    }
  };
  

  const handleManageBilling = async () => {
    const res = await fetch("/api/stripe-portal");
    const data = await res.json();
    if (data?.url) {
      window.location.href = data.url;
    } else {
      alert("Unable to redirect to billing portal.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Choose Your Plan</h1>

      {/* Subscription Status Display */}
      {subscription ? (
        <div className="bg-zinc-800 border border-zinc-700 text-white rounded-xl p-4 text-center mb-6 w-full max-w-md">
          <p><strong>Current Plan:</strong> {subscription.plan}</p>
          <p><strong>Status:</strong> {subscription.status}</p>
          {subscription.renews_at && (
            <p><strong>Renews At:</strong> {subscription.renews_at}</p>
          )}
          {subscription.status === "active" && (
            <Button className="mt-4" onClick={handleManageBilling}>
              Manage Subscription
            </Button>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground mb-6">Checking subscription status...</p>
      )}

      {/* Show pricing only if no active sub */}
      {subscription?.status !== "active" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full">
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

          {/* Coupon */}
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
        </>
      )}
    </div>
  );
}
