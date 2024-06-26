"use server";

import { cookies } from "next/headers";

// Function to check if a movie is in the user's watchlist
export async function checkWatchlist(trakt) {
  const access_token = cookies().get("access_token").value;
  try {
    const response = await fetch(
      `https://api.trakt.tv/users/me/watchlist/movies/`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "trakt-api-version": 2,
          "trakt-api-key": process.env.CLIENT_ID,
        },
      }
    );

    if (response.ok) {
      const watchlist = await response.json();

      // Check if the tmdbId exists in the watchlist
      const isMovieInWatchlist = watchlist.some(
        (movie) => movie.movie.ids.trakt === trakt
      );

      return isMovieInWatchlist;
    } else {
      console.error("Error retrieving watchlist:", response.statusText);
      return false;
    }
  } catch (error) {
    console.error("Error checking watchlist:", error);
    return false;
  }
}
