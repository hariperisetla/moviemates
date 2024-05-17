"use server";

import Search from "@/components/SearchInput";

async function getData() {
  try {
    const response = await fetch(
      "https://api.trakt.tv/search/movie?query=the idea",
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

async function getSearchData(query) {
  try {
    const response = await fetch(
      `https://api.trakt.tv/search/movie?query=${encodeURIComponent(query)}`,
      {
        headers: {
          "Content-type": "application/json",
          "trakt-api-version": "2",
          "trakt-api-key": process.env.REACT_APP_CLIENT_ID,
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
              Authorization: `Bearer ${process.env.REACT_APP_TMDB_ID}`,
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

export default async function Movies() {
  const data = await getData();

  let newData = data;

  let searchQuery = "";

  async function handleSearchChange(event) {
    const query = event.target.value;

    const searchData = await getSearchData(query);
    newData = searchData;
  }

  return (
    <div className="space-y-5 pt-5 items-center flex flex-col">
      <h1 className="text-3xl">Movies</h1>

      <Search
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
      />

      <ul className="grid grid-cols-8 gap-5">
        {newData.map((movieData, index) => (
          <li
            key={index}
            className="flex flex-col justify-between bg-indigo-200"
          >
            <div>
              {movieData.imageUrl && (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movieData.imageUrl}`}
                  alt={movieData.movie.title}
                />
              )}
              <h2 className="px-5 items-center py-3">
                {movieData.movie.title} ({movieData.movie.year})
              </h2>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
