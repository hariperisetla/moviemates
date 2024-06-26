"use server";

import { checkWatchlist } from "./checkWatchlist";

// Function to fetch trending movies and include watchlist flag
export async function getTrendingMovies(page = 1, limit = 10) {
  try {
    const response = await fetch(
      `https://api.trakt.tv/movies/trending?page=${page}&limit=${limit}&extended=full`,
      {
        headers: {
          "Content-type": "application/json",
          "trakt-api-version": 2,
          "trakt-api-key": process.env.CLIENT_ID,
        },
      }
    );

    const data = await response.json();

    // Fetch image URLs and add watchlist flag for each movie
    const moviesWithImagesAndWatchlistFlag = await Promise.all(
      data.map(async (movieData) => {
        // Check if movie is in user's watchlist
        const isInWatchlist = await checkWatchlist(movieData.movie.ids.trakt);

        // Fetch image URLs for the movie
        const imageResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${movieData.movie.ids.tmdb}/images`,
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
          movie: movieData.movie,
          portraitImageUrl:
            portraitImages.length > 0 ? portraitImages[0].file_path : null,
          landscapeImageUrl:
            landscapeImages.length > 0 ? landscapeImages[0].file_path : null,
          isInWatchlist: isInWatchlist, // Add flag indicating if movie is in watchlist
        };
      })
    );

    return moviesWithImagesAndWatchlistFlag;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
