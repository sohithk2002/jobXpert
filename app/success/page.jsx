"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    async function fetchSession() {
      if (!sessionId) return;
      try {
        const res = await fetch(`/api/stripe-session?session_id=${sessionId}`);
        const data = await res.json();
        setSession(data);
      } catch (error) {
        console.error("❌ Error fetching session:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, [sessionId]);

  if (loading) {
    return <p className="text-center mt-10">Fetching subscription details...</p>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 text-center space-y-4">
      <h1 className="text-3xl font-bold">✅ Subscription Confirmed!</h1>
      <p className="text-lg">Thanks, {session?.customer_details?.email}!</p>
      <p className="text-sm text-muted-foreground">
        You are now subscribed to our PRO plan.
      </p>
      <Button onClick={() => router.push("/dashboard")} className="mt-4">
        Return to Dashboard
      </Button>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Loading...</p>}>
      <SuccessContent />
    </Suspense>
  );
}

