"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // Make sure this path is correct

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    async function fetchSession() {
      if (!sessionId) return;
      try {
        const res = await fetch(`/api/stripe-session?session_id=${sessionId}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Session fetch failed");

        setSession(data);
      } catch (err) {
        console.error("Stripe session fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, [sessionId]);

  if (loading) {
    return <p className="text-center mt-10 text-white">Fetching subscription details...</p>;
  }

  return (
    <div className="max-w-xl mx-auto mt-20 text-center text-white space-y-6">
      <h1 className="text-4xl font-bold">✅ Payment Successful!</h1>
      <p className="text-lg">Thanks, <span className="font-semibold">{session?.customer_details?.email}</span>!</p>
      <p className="text-sm text-muted-foreground">
        You’re now subscribed to our <strong>PRO</strong> plan.
      </p>
      <Button onClick={() => router.push("/")} className="mt-4">
        ⬅️ Return Home
      </Button>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<p className="text-center mt-10 text-white">Loading...</p>}>
      <SuccessContent />
    </Suspense>
  );
}
