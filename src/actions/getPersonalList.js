"use server";

import { cookies } from "next/headers";
import { getUserSettings } from "./getUserSettings";

export async function getPersonalList() {
  const access_token = cookies().get("access_token").value;

  try {
    const settings = await getUserSettings();

    const response = await fetch(
      `https://api.trakt.tv/users/${settings.user.username}/lists`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
          "trakt-api-version": 2,
          "trakt-api-key": process.env.CLIENT_ID,
        },
      }
    );

    const lists = await response.json();

    let movieCount = 0;
    let showCount = 0;

    const listsWithItems = await Promise.all(
      lists.map(async (list) => {
        const itemsResponse = await fetch(
          `https://api.trakt.tv/users/${settings.user.username}/lists/${list.ids.slug}/items`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`,
              "trakt-api-version": 2,
              "trakt-api-key": process.env.CLIENT_ID,
            },
          }
        );

        const items = await itemsResponse.json();
        const topItems = items.slice(0, 4);

        const itemsWithImages = await Promise.all(
          topItems.map(async (item) => {
            const tmdbId = item.movie?.ids?.tmdb || item.show?.ids?.tmdb;
            if (!tmdbId) return item;

            const imageResponse = await fetch(
              `https://api.themoviedb.org/3/movie/${tmdbId}/images`,
              {
                headers: {
                  accept: "application/json",
                  Authorization: `Bearer ${process.env.TMDB_ID}`,
                },
              }
            );

            const imageData = await imageResponse.json();

            const portraitImageUrl =
              imageData.posters?.length > 0
                ? `https://image.tmdb.org/t/p/w500${imageData.posters[0].file_path}`
                : null;
            const landscapeImageUrl =
              imageData.backdrops?.length > 0
                ? `https://image.tmdb.org/t/p/w500${imageData.backdrops[0].file_path}`
                : null;

            // Increment counters based on item type
            if (item.movie) movieCount++;
            if (item.show) showCount++;

            return {
              ...item,
              portraitImageUrl,
              landscapeImageUrl,
            };
          })
        );

        return {
          ...list,
          items: itemsWithImages,
          movieCount: movieCount,
          showCount: showCount,
        };
      })
    );

    console.log(`Total Movies: ${movieCount}`);
    console.log(`Total Shows: ${showCount}`);

    return listsWithItems;
  } catch (error) {
    console.log(error);
    throw new Error("Error while fetching personal lists with items");
  }
}
