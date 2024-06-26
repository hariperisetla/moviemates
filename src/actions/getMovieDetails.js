"use server";

import { checkWatchlist } from "./checkWatchlist";

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

    const ratingsTest = await fetch(
      `https://api.trakt.tv/movies/${movieData.ids.imdb}/ratings`,
      {
        headers: {
          "Content-type": "application/json",
          "trakt-api-version": 2,
          "trakt-api-key": process.env.CLIENT_ID,
        },
      }
    );

    const ratings = await ratingsTest.json();

    console.log(movieData.ids.imdb);

    // console.log(movieData);
    const isInWatchlist = await checkWatchlist(movieData.ids.trakt);

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

    // Filter for portrait images with aspect ratio close to 350x450 or less than the 450 ratio, and text in English or matching movie language
    const portraitImages = imageData.posters.filter((image) => {
      const aspectRatio = image.width / image.height;
      const isEnglish = image.iso_639_1 === "en";
      const isMatchingLanguage = movieData.language === image.iso_639_1;

      return (
        // (aspectRatio <= 350 / 450 || aspectRatio < 450 / image.height) &&
        isEnglish || isMatchingLanguage || image
      );
    });

    const landscapeImages = imageData.backdrops;

    const movieWithImage = {
      ...movieData,
      portraitImageUrl:
        portraitImages.length > 0 ? portraitImages[0].file_path : null,
      landscapeImageUrl:
        landscapeImages.length > 0 ? landscapeImages[0].file_path : null,

      isInWatchlist: isInWatchlist,
    };

    return movieWithImage;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
