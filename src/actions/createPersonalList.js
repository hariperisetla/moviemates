"use server";

import { cookies } from "next/headers";
import { getUserSettings } from "./getUserSettings";

export async function createPersonalList(listData) {
  const access_token = cookies().get("access_token").value;

  try {
    const settings = await getUserSettings();

    const response = await fetch(
      `https://api.trakt.tv/users/${settings.user.username}/lists`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
          "trakt-api-version": 2,
          "trakt-api-key": process.env.CLIENT_ID,
        },
        body: JSON.stringify(listData),
      }
    );

    const data = await response.json();

    return data;
  } catch (error) {
    // throw Error("Error while creating a list: ", error.message);

    console.log(error);
  }
}
