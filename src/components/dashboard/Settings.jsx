"use client";
import { getUserSettings } from "@/actions/getUserSettings";
import { setUserSettings } from "@/actions/setUserSettings";
import { useState } from "react";

export default function Settings() {
  const [file, setFile] = useState(null);

  async function handleSettings() {
    const settings = await getUserSettings();

    console.log(settings);
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the form data
    // const formData = new FormData();
    // formData.append(
    //   "avatar",
    //   "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg"
    // ); // Assuming 'avatar' is the key expected by Trakt API

    try {
      const response = await setUserSettings();

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Profile picture updated successfully:", data);
    } catch (error) {
      console.error("Error updating profile picture:", error.message);
    }
  };

  return (
    <div>
      <button onClick={handleSettings}>Settings</button>

      <form onSubmit={handleSubmit}>
        {/* <input type="file" onChange={handleFileChange} /> */}
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}
