"use server";

import { checkWatchlist } from "./checkWatchlist";

// Function to fetch trending movies and include watchlist flag
export async function getTrendingMovies(page = 1, limit = 10, type = "movies") {
  try {
    const response = await fetch(
      `https://api.trakt.tv/${type}/trending?page=${page}&limit=${limit}&extended=full`,
      {
        headers: {
          "Content-type": "application/json",
          "trakt-api-version": 2,
          "trakt-api-key": process.env.CLIENT_ID,
        },
      }
    );

    const data = await response.json();

    // Fetch image URLs and add watchlist flag for each item
    const itemsWithImagesAndWatchlistFlag = await Promise.all(
      data.map(async (itemData) => {
        // Determine if it's a movie or a show
        const item = type === "movies" ? itemData.movie : itemData.show;

        // Check if item is in user's watchlist
        const isInWatchlist = await checkWatchlist(item.ids.trakt);

        // Fetch image URLs for the item
        const imageResponse = await fetch(
          `https://api.themoviedb.org/3/${type === "movies" ? "movie" : "tv"}/${
            item.ids.tmdb
          }/images`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${process.env.TMDB_ID}`,
            },
          }
        );
        const imageData = await imageResponse.json();

        const filterEnglishImages = (images) => {
          const englishImages = images.filter(
            (image) => image.iso_639_1 === "en"
          );
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

        // console.log(imageData.backdrops);

        const portraitImages = filterEnglishImages(imageData.posters);
        const landscapeImages = imageData.backdrops;

        console.log(landscapeImages);

        // const landscapeImages = filterEnglishImages(imageData.backdrops);

        return {
          item: item,
          type: type,
          portraitImageUrl:
            portraitImages.length > 0 ? portraitImages[0].file_path : null,
          landscapeImageUrl:
            landscapeImages.length > 0 ? landscapeImages[0].file_path : null,
          isInWatchlist: isInWatchlist, // Add flag indicating if item is in watchlist
        };
      })
    );

    return itemsWithImagesAndWatchlistFlag;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
