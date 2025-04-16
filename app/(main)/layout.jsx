"use client";
import { useEffect } from "react";

export default function MainLayout({ children }) {
  useEffect(() => {
    fetch("/api/check-user"); // 👈 We’ll create this route next
  }, []);

  return <>{children}</>;
}
