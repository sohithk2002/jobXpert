"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSession() {
      if (!sessionId) return;

      try {
        // 1. Get Stripe session details
        const res = await fetch(`/api/stripe-session?session_id=${sessionId}`);
        if (!res.ok) throw new Error("Failed to fetch session details");

        const data = await res.json();
        setSession(data);

        // 2. Ensure user is created in the DB
        const checkRes = await fetch("/api/check-user");
        if (!checkRes.ok) {
          console.error("❌ User creation failed or unauthorized.");
        }
      } catch (err) {
        setError("Something went wrong. Please contact support.");
        console.error("⚠️ Error during success page:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, [sessionId]);

  if (loading) {
    return <p className="text-center mt-10 text-gray-400">🔄 Fetching subscription details...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  const userEmail = session?.customer_email || "your email";

  return (
    <div className="max-w-md mx-auto mt-24 bg-zinc-900 border border-green-500 rounded-2xl shadow-[0_0_12px_#22c55e] p-8 text-center text-white">
      <h2 className="text-2xl font-bold text-green-400 mb-4">🎉 Payment Successful!</h2>
      <p className="mb-2">
        Thank you, <span className="text-blue-400 font-medium">{userEmail}</span>
      </p>
      <p className="mb-6">
        You’ve successfully subscribed to our <span className="font-semibold text-white">PRO plan</span>.<br />
        You now have unlimited access to all features.
      </p>
      <a
        href="/dashboard"
        className="inline-block bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-md transition"
      >
        Go to Dashboard
      </a>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<p className="text-center mt-10 text-gray-400">Loading subscription details...</p>}>
      <SuccessContent />
    </Suspense>
  );
}
