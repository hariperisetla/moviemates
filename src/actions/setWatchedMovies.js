"use server";

import { cookies } from "next/headers";

async function getHistory() {
  const access_token = cookies().get("access_token").value;
  try {
    const response = await fetch(`https://api.trakt.tv/sync/history/movies`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
        "trakt-api-version": 2,
        "trakt-api-key": process.env.CLIENT_ID,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching watched history: " + error); // Log error using console.error
    return [];
  }
}

export async function removeFromHistory(movieId) {
  const access_token = cookies().get("access_token").value;
  try {
    const response = await fetch(`https://api.trakt.tv/sync/history/remove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
        "trakt-api-version": 2,
        "trakt-api-key": process.env.CLIENT_ID,
      },
      body: JSON.stringify({
        movies: [
          {
            ids: {
              trakt: movieId,
            },
          },
        ],
      }),
    });

    const res = await response.json();

    if (response.ok) {
      console.log("Movie removed from history successfully.");
      return "ok";
    } else {
      console.error(
        "Error removing movie from history: ",
        await response.json()
      ); // Log error using console.error
      return "error"; // Return an error indicator
    }
  } catch (error) {
    console.error("Error removing movie from history: " + error); // Log error using console.error
    return "error"; // Return an error indicator
  }
}

export async function setWatchedMovies(movie) {
  const access_token = cookies().get("access_token").value;
  try {
    // Fetch the watched history first
    const history = await getHistory();

    // Check if the movie is already in the watched history
    const isAlreadyWatched = history.some(
      (entry) => entry.movie.ids.trakt === movie.ids.trakt
    );

    if (isAlreadyWatched) {
      await removeFromHistory(movie.ids.trakt); // Pass the movieId to removeFromHistory
    }

    // If the movie is not in the watched history, mark it as watched
    const response = await fetch(`https://api.trakt.tv/sync/history`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
        "trakt-api-version": 2,
        "trakt-api-key": process.env.CLIENT_ID,
      },
      body: JSON.stringify({
        movies: [
          {
            ids: {
              trakt: movie.ids.trakt,
            },
            watched_at: new Date().toISOString(), // Current date and time in ISO 8601 format
          },
        ],
      }),
    });

    if (response.ok) {
      console.log(`Movie "${movie.title}" marked as watched.`);

      return "ok";
    } else {
      console.error("Error marking movie as watched: ", await response.json());
    }
  } catch (error) {
    console.error("Error marking movie as watched: " + error); // Log error using console.error
  }
}
