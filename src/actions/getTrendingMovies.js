"use server";

export async function getTrendingMovies(page = 1) {
  try {
    const response = await fetch(
      `https://api.trakt.tv/movies/trending?page=${page}&limit=10`,
      {
        headers: {
          "Content-type": "application/json",
          "trakt-api-version": 2,
          "trakt-api-key": process.env.CLIENT_ID,
        },
      }
    );

    const data = await response.json();

    // Fetch image URLs for each movie
    const moviesWithImages = await Promise.all(
      data.map(async (movieData) => {
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
        return {
          ...movieData,
          imageUrl: imageData.posters[0]?.file_path || null, // Assuming you want the first poster image
        };
      })
    );

    return moviesWithImages;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
