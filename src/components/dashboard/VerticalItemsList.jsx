import { getWatchlistMovies } from "@/actions/getWatchlistMovies";
import { getTrendingMovies } from "@/actions/getTrendingMovies";

import List from "@/components/dashboard/List";

async function getMovies(listType, type) {
  let newItems = [];

  switch (listType) {
    case "watchlist":
      newItems = await getWatchlistMovies();
      break;
    case "trending":
      newItems = await getTrendingMovies(undefined, 10, type);
  }
  return newItems;
}

export default async function VerticalItemsList({ listType, type }) {
  const items = await getMovies(listType, type);

  return (
    <div className="text-left">
      {items.length > 0 && (
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
            <List items={items} />
          </div>
        </div>
      )}
    </div>
  );
}
