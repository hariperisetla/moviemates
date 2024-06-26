"use server";

import { cookies } from "next/headers";
import { checkWatchlist } from "@/actions/checkWatchlist";

// Function to set movies in watchlist
export async function setWatchlistMovies(movieId) {
  const access_token = cookies().get("access_token").value;
  try {
    // First, check if the movie is already in the watchlist
    const isInWatchlist = await checkWatchlist(movieId);

    if (!isInWatchlist) {
      // If not in watchlist, proceed to add it
      const response = await fetch(`https://api.trakt.tv/sync/watchlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
          "trakt-api-version": 2,
          "trakt-api-key": process.env.CLIENT_ID,
        },
        body: JSON.stringify({
          movies: [{ ids: { trakt: movieId } }],
        }),
      });

      if (response.ok) {
        return true; // Watchlist updated successfully
      } else {
        const errorData = await response.json();
        throw new Error(`Failed to update watchlist: ${errorData.message}`);
      }
    } else {
      // If already in watchlist, proceed to remove it
      const response = await fetch(`https://api.trakt.tv/sync/watchlist/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
          "trakt-api-version": 2,
          "trakt-api-key": process.env.CLIENT_ID,
        },
        body: JSON.stringify({
          movies: [{ ids: { trakt: movieId } }],
        }),
      });

      if (response.ok) {
        return true; // Movie removed from watchlist successfully
      } else {
        const errorData = await response.json();
        throw new Error(`Failed to remove from watchlist: ${errorData.message}`);
      }
    }
  } catch (error) {
    console.error("Error setting watchlist: " + error);
    return false;
  }
}
