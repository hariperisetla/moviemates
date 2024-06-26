import { getWatchlistMovies } from "@/actions/getWatchlistMovies";
import { getTrendingMovies } from "@/actions/getTrendingMovies";

import List from "@/components/dashboard/List";

async function getMovies(type) {
  let newMovies = [];

  switch (type) {
    case "watchlist":
      newMovies = await getWatchlistMovies();
      break;
    case "trending":
      newMovies = await getTrendingMovies();
  }
  return newMovies;
}

export default async function VerticalItemsList({ type }) {
  const movies = await getMovies(type);

  return (
    <div className="text-left">
      {movies.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">
            {type === "watchlist" ? (
              <span>
                Next on <span className="text-primary">next watch</span> list
              </span>
            ) : type === "trending" ? (
              <span>
                Trending <span className="text-primary">now</span>
              </span>
            ) : (
              <span>
                Next on <span className="text-primary">next watch</span> list
              </span>
            )}
          </h2>
          <div className="relative">
            <List movies={movies} />
          </div>
        </div>
      )}
    </div>
  );
}
