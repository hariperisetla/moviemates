"use server";

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

        // Filter for portrait images with English text or matching movie language
        const portraitImages = imageData.posters.filter((image) => {
          return (
            image.iso_639_1 === "en" ||
            movieData.movie.language === image.iso_639_1
          );
        });

        return {
          ...movieData,
          imageUrl:
            portraitImages.length > 0 ? portraitImages[0].file_path : null, // Assuming you want the first poster image
        };
      })
    );

    return moviesWithImages;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
