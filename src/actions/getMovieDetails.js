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

    const filterEnglishImages = (images) => {
      const englishImages = images.filter((image) => image.iso_639_1 === "en");
      return englishImages.length > 0 ? englishImages : images;
    };

    const filterTitleImages = (images) => {
      const excludedKeywords = ["title", "logo", "poster"];
      return images.filter(
        (image) =>
          !excludedKeywords.some((keyword) =>
            image.file_path.toLowerCase().includes(keyword)
          )
      );
    };

    const portraitImages = filterEnglishImages(imageData.posters);
    const landscapeImages = filterTitleImages(
      filterEnglishImages(imageData.backdrops)
    );

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
