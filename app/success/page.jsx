// app/success/page.jsx
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

  if (loading) return <p className="text-center mt-10">🔄 Fetching your subscription details...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-xl mx-auto mt-16 text-center space-y-6 bg-white p-8 shadow-xl rounded-xl">
      <h1 className="text-4xl font-bold text-green-600">🎉 Payment Successful!</h1>
      <p className="text-lg font-medium text-gray-800">
        Thank you, <span className="text-blue-600">{session?.customer_details?.email}</span>!
      </p>
      <p className="text-gray-600">
        You’ve successfully subscribed to our <strong>PRO plan</strong>. You now have unlimited access to all features.
      </p>
      <div className="mt-6">
        <a href="/dashboard">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            Go to Dashboard
          </button>
        </a>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Loading subscription details...</p>}>
      <SuccessContent />
    </Suspense>
  );
}
