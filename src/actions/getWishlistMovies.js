"use server";

import { cookies } from "next/headers";

export async function getWishlistMovies(limit = null) {
  try {
    const access_token = cookies().get("access_token").value;

    const response = await fetch(
      `https://api.trakt.tv/sync/watchlist/movies${
        limit ? `?limit=${limit}` : ""
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

    console.log(watchList);

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
        return {
          ...movies,
          imageUrl: imageData.posters[0]?.file_path || null, // Assuming you want the first poster image
        };
      })
    );

    return moviesWithImages;
  } catch (error) {
    console.log("Error fetching watchlist: " + error);
    return null;
  }
}
