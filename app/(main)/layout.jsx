"use client";
import { useEffect } from "react";

export default function MainLayout({ children }) {
  useEffect(() => {
    fetch("/api/check-user");
  }, []);

  return (
    <main className="pt-20 px-4"> {/* 👈 Add padding here */}
      {children}
    </main>
  );
}
