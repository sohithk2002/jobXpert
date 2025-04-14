"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";

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
        const res = await fetch(`/api/stripe-session?session_id=${sessionId}`);
        if (!res.ok) throw new Error("Failed to fetch session details");

        const data = await res.json();
        setSession(data);
      } catch (err) {
        setError("Something went wrong. Please contact support.");
        console.error("⚠️ Error fetching session:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, [sessionId]);

  if (loading) {
    return (
      <p className="text-center mt-10 text-white">
        🔄 Fetching subscription details...
      </p>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-900 text-red-400 px-6 py-4 rounded-lg border border-red-500 shadow-md">
          ❌ {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-green-950 border border-green-400 text-white px-10 py-8 rounded-lg shadow-lg w-[400px] text-center">
        <h1 className="text-2xl font-semibold text-green-400 mb-2 flex items-center justify-center gap-2">
          ✅ Payment Successful!
        </h1>
        <p className="text-md">
          Thank you,{" "}
          <span className="text-blue-300 font-semibold underline">
            {session?.customer_details?.email}
          </span>
        </p>
        <p className="text-sm text-green-200 mt-2">
          You’ve successfully subscribed to our <strong>PRO plan</strong>. You now have unlimited access to all features.
        </p>
        <div className="mt-5">
          <a href="/dashboard">
            <button className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded transition">
              Go to Dashboard
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<p className="text-center mt-10 text-white">Loading subscription details...</p>}>
      <SuccessContent />
    </Suspense>
  );
}
