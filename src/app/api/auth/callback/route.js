// pages/api/auth/callback.js
import { NextResponse } from "next/server";

export async function GET(req) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  try {
    const fetchResponse = await fetch(`https://api.trakt.tv/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    if (!fetchResponse.ok) {
      throw new Error(`HTTP error! status: ${fetchResponse.status}`);
    }

    const data = await fetchResponse.json();
    const { access_token, refresh_token, expires_in } = data;

    const isProduction = process.env.NODE_ENV === "production";

    const cookieOptions = {
      path: "/",
      httpOnly: true,
      secure: isProduction,
    };

    let response = NextResponse.redirect(new URL("/home", req.url));

    response.cookies.set("access_token", access_token, {
      ...cookieOptions,
      maxAge: expires_in,
    });

    response.cookies.set("refresh_token", refresh_token, cookieOptions);

    return response;
  } catch (error) {
    console.error("Error fetching token:", error);
    return NextResponse.json(
      { error: "Failed to fetch token" },
      { status: 500 }
    );
  }
}
