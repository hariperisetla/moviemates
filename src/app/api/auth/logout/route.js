// pages/api/auth/logout.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Retrieve the access token from the request
    const { access_token } = req.cookies.getAll();

    // Make a request to the Trakt API's revoke endpoint
    const response = await fetch(`https://api.trakt.tv/oauth/revoke`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: access_token,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Clear cookies to log the user out
    const clearCookieResponse = NextResponse.redirect(new URL("/", req.url));
    clearCookieResponse.cookies.delete("access_token", { path: "/" });
    clearCookieResponse.cookies.delete("refresh_token", { path: "/" });

    return clearCookieResponse;
  } catch (error) {
    console.error("Error revoking access token:", error);
    return NextResponse.json(
      { error: "Failed to revoke access token" },
      { status: 500 }
    );
  }
}
