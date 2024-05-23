"use server";

export async function getMovieDetails(slug) {
  try {
    const response = await fetch(
      `https://api.trakt.tv/movies/${slug}?extended=full`,
      {
        headers: {
          "Content-type": "application/json",
          "trakt-api-version": 2,
          "trakt-api-key": process.env.CLIENT_ID,
        },
      }
    );

    const movieData = await response.json();

    // Fetch the image URLs for the movie
    const imageResponse = await fetch(
      `https://api.themoviedb.org/3/movie/${movieData.ids.tmdb}/images`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.TMDB_ID}`,
        },
      }
    );

    const imageData = await imageResponse.json();
    // Filter for non-portrait images (backdrops)
    const portraitImages = imageData.posters;
    const landscapeImages = imageData.backdrops;

    const movieWithImage = {
      ...movieData,
      portraitImageUrl:
        portraitImages.length > 0 ? portraitImages[0].file_path : null,
      landscapeImageUrl:
        landscapeImages.length > 0 ? landscapeImages[0].file_path : null,
    };

    return movieWithImage;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
