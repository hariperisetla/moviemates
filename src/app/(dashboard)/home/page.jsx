import Image from "next/image";
import Link from "next/link";

async function getData() {
  try {
    const response = await fetch(
      "https://api.trakt.tv/movies/trending?limit=20",
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
    <div className="space-y-3 pt-3 items-center w-full text-center">
      <h1 className="text-2xl text-indigo-600">Trending Movies</h1>

      {/* <Search
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
      /> */}

      <ul className="grid grid-cols-2 md:grid-cols-8 gap-3 px-3">
        {newData.map((movieData, index) => (
          <Link
            href={`/movies/${movieData.movie.ids.slug}`}
            key={index}
            className="relative bg-indigo-600 pb-10 rounded-xl overflow-hidden"
          >
            <div className="relative w-full h-72 rounded-t-xl overflow-hidden">
              <Image
                src={`https://image.tmdb.org/t/p/w500${movieData.imageUrl}`}
                alt={movieData.movie.title}
                fill
                className="object-cover object-center"
              />
            </div>
            <div className="absolute w-full z-10 bottom-0 backdrop-blur-lg">
              <p className="px-3 text-indigo-50 text-xs items-center py-3">
                {movieData.movie.title.length > 16
                  ? `${movieData.movie.title.substring(0, 16)}...`
                  : movieData.movie.title}{" "}
                ({movieData.movie.year})
              </p>
            </div>
          </Link>
        ))}
      </ul>
    </div>
  );
}
