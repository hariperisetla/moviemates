"use server";

import { cookies } from "next/headers";

export async function getWatchlistMovies(limit = null) {
  const access_token = cookies().get("access_token").value;
  try {
    const response = await fetch(
      `https://api.trakt.tv/sync/watchlist/movies?extended=full${
        limit ? `&limit=${limit}` : ""
      }`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
          "trakt-api-version": 2,
          "trakt-api-key": process.env.CLIENT_ID,
        },
      }
    );

    const watchList = await response.json();

    // Fetch image URLs for each movie
    const moviesWithImages = await Promise.all(
      watchList.map(async (movies) => {
        const imageResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${movies.movie.ids?.tmdb}/images`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${process.env.TMDB_ID}`,
            },
          }
        );
        const imageData = await imageResponse.json();

        const portraitImages = imageData.posters;
        const landscapeImages = imageData.backdrops;

        return {
          movie: movies.movie,
          portraitImageUrl:
            portraitImages.length > 0 ? portraitImages[0].file_path : null,
          landscapeImageUrl:
            landscapeImages.length > 0 ? landscapeImages[0].file_path : null,
        };
      })
    );

    return moviesWithImages;
  } catch (error) {
    console.log("Error fetching watchlist: " + error);
    return null;
  }
}
