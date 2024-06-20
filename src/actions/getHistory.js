"use server";

import { cookies } from "next/headers";

export async function getHistory(id) {
  const access_token = cookies().get("access_token").value;
  try {
    const response = await fetch(
      `https://api.trakt.tv/sync/history/movies/${id}?limit=10`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
          "trakt-api-version": 2,
          "trakt-api-key": process.env.CLIENT_ID,
        },
      }
    );

    const data = await response.json();

    return data;
  } catch (error) {
    console.log("Error marking movie as watched: " + error);
  }
}
