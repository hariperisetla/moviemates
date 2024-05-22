import Link from "next/link";
import React from "react";

export default function Login() {
  return (
    <div>
      Login
      <Link
        href={`https://api.trakt.tv/oauth/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}`}
        className="bg-primary text-white rounded-md px-3 py-2"
      >
        Login
      </Link>
    </div>
  );
}
