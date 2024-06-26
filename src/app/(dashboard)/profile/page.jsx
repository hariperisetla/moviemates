"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (response.ok) {
        // Redirect to the home page or any other page after logout
        router.push("/");
      } else {
        console.error("Failed to logout:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to logout:", error.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>Profile</h1>
      <button
        onClick={handleLogout}
        disabled={loading}
        className="text-lg font-semibold text-red-500"
      >
        Logout
      </button>
    </div>
  );
}
