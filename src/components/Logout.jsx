"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
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
    <button onClick={handleLogout} disabled={loading}>
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
};

export default LogoutButton;
