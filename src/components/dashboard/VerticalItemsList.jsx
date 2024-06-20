import { getWishlistMovies } from "@/actions/getWishlistMovies";
import { getTrendingMovies } from "@/actions/getTrendingMovies";

import List from "@/components/dashboard/List";

async function getMovies(type) {
  let newMovies = [];

  switch (type) {
    case "watchlist":
      newMovies = await getWishlistMovies();
      break;
    case "trending":
      newMovies = await getTrendingMovies();
  }
  return newMovies;
}

export default async function VerticalItemsList({ type }) {
  const movies = await getMovies(type);

  return (
    <div className="relative">
      <List movies={movies} />
    </div>
  );
}
