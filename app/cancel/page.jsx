"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="flex justify-center items-center min-h-screen px-4 bg-background">
      <Card
        tabIndex={-1}
        className="w-full max-w-md shadow-xl border border-red-500 focus:outline-none focus:ring-0"
      >
        <CardContent className="text-center py-10">
          <h1 className="text-3xl font-bold text-red-500 mb-4">
            ❌ Payment Cancelled
          </h1>
          <p className="text-muted-foreground">
            You didn’t complete the payment. No worries — you can try again anytime!
          </p>

          <Link href="/">
            <Button className="mt-6" variant="outline">
              Return Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
