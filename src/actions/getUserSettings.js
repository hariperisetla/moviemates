"use server";

import { cookies } from "next/headers";

export async function getUserSettings() {
  const access_token = cookies().get("access_token").value;
  try {
    const response = await fetch(`https://api.trakt.tv/users/settings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
        "trakt-api-version": 2,
        "trakt-api-key": process.env.CLIENT_ID,
      },
    });

    const data = await response.json();

    // console.log(data);

    return data;
  } catch (error) {
    console.log("Error marking movie as watched: " + error);
  }
}
