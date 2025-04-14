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
        const res = await fetch(`/api/stripe-session?session_id=${sessionId}`);
        if (!res.ok) throw new Error("Failed to fetch session details");

        const data = await res.json();
        setSession(data);
      } catch (err) {
        setError("Something went wrong. Please contact support.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, [sessionId]);

  if (loading) {
    return <p className="text-center mt-10 text-white">Fetching subscription details...</p>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="border border-red-500 text-red-500 bg-black p-8 rounded-md text-center">
          ❌ {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="border border-green-500 text-green-500 p-8 rounded-md text-center max-w-md w-full">
        <h2 className="text-2xl font-bold mb-2">✅ Payment Successful</h2>
        <p className="text-white mb-4">
          Thank you,{" "}
          <span className="text-blue-400 font-semibold">
            {session?.customer_details?.email}
          </span>
          !
        </p>
        <p className="text-white mb-6">
          You’ve successfully subscribed to our <strong>PRO plan</strong>. You now have unlimited access to all tools.
        </p>
        <a href="/dashboard">
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
            Go to Dashboard
          </button>
        </a>
      </div>
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
