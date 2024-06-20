"use server";

export async function getSearchMovies(query) {
  try {
    const response = await fetch(
      `https://api.trakt.tv/search/movie?query=${query}&limit=5`,
      {
        headers: {
          "Content-Type": "application/json",
          "trakt-api-version": 2,
          "trakt-api-key": process.env.CLIENT_ID,
        },
      }
    );

    const searchResults = await response.json();

    console.log(searchResults);

    // Fetch image URLs for each movie
    const moviesWithImages = await Promise.all(
      searchResults.map(async (movies) => {
        const imageResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${movies.movie.ids.tmdb}/images`,
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
