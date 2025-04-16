export default function CancelPage() {
    return (
      <div className="max-w-md mx-auto mt-24 bg-zinc-900 border border-red-500 rounded-2xl shadow-[0_0_12px_#ef4444] p-8 text-center text-white">
        <h2 className="text-2xl font-bold text-red-400 mb-4">❌ Payment Cancelled</h2>
        <p className="mb-4">
          Looks like your payment was not completed. No worries — you can try again anytime.
        </p>
        <a
          href="/pricing"
          className="inline-block bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          Return to Pricing
        </a>
      </div>
    );
  }
  