"use server";

import { cookies } from "next/headers";
import { getUserSettings } from "./getUserSettings";

export async function setUserSettings(formData) {
  const access_token = cookies().get("access_token").value;

  // Fetch existing settings
  const settings = await getUserSettings();

  console.log("Existing settings:", settings);
  console.log("New form data:", formData);

  // Update only the name field in the existing settings
  const updatedSettings = {
    ...settings,
    user: {
      ...settings.user,
      name: formData.user.name,
    },
  };

  console.log("Updated settings:", updatedSettings);

  try {
    const response = await fetch(`https://api.trakt.tv/users/settings`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
        "trakt-api-version": "2",
        "trakt-api-key": process.env.CLIENT_ID,
      },
      body: JSON.stringify(updatedSettings), // Send the merged settings
    });

    // if (!response.ok) {
    //   throw new Error(`HTTP error! Status: ${response.status}`);
    // }

    const data = await response.json();

    console.log("Response data:", data);

    return data;
  } catch (error) {
    console.error("Error updating user settings:", error);
    throw error; // Re-throw the error to handle it elsewhere if needed
  }
}
