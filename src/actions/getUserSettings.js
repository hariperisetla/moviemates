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

    // console.log(data.user.images);

    // console.log(data);

    const listsResponse = await fetch(
      `https://api.trakt.tv/users/${data.user.username}/lists/
28209205`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${access_token}`,
          "trakt-api-version": 2,
          "trakt-api-key": process.env.CLIENT_ID,
        },
      }
    );

    const lists = await listsResponse.json();

    console.log(lists);

    return lists;
  } catch (error) {
    console.log("Error marking movie as watched: " + error);
  }
}
