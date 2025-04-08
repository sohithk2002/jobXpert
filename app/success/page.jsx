"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    async function fetchSession() {
      if (!sessionId) return;
      try {
        const res = await fetch(`/api/stripe-session?session_id=${sessionId}`);
        const data = await res.json();
        setSession(data);
      } catch (err) {
        console.error("Error fetching session", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSession();
  }, [sessionId]);

  if (loading) return <p className="text-center mt-10">Fetching subscription details...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 text-center space-y-4">
      <h1 className="text-3xl font-bold text-green-600">✅ Subscription Confirmed!</h1>
      <p className="text-lg">
        Thanks, <span className="font-medium">{session?.customer_details?.email}</span>!
      </p>
      <p className="text-sm text-muted-foreground">
        You are now subscribed to our PRO plan.
      </p>
    </div>
  );
}
