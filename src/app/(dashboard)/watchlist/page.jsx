"use client";

import { getWatchlistMovies } from "@/actions/getWatchlistMovies";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function WatchList() {
  const [movies, setMovies] = useState();

  useEffect(() => {
    async function fetchList() {
      let moviesList = await getWatchlistMovies();

      setMovies(moviesList);
    }

    fetchList();
  }, []);

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-semibold text-primary">WatchList</h2>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-5 md:gap-10">
        {movies &&
          movies.map((movieData, index) => (
            <div key={index} className="flex flex-col space-y-3 w-full">
              <Link
                href={`/movies/${movieData.movie?.ids.slug}`}
                key={index}
                className="relative w-32 h-52 md:w-48 md:h-72 rounded-3xl overflow-hidden"
              >
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movieData.portraitImageUrl}`}
                  alt={movieData.movie?.title}
                  fill
                  className="object-cover object-center"
                />
              </Link>
              <div className="w-full rounded-b-xl overflow-hidden">
                <p className="text-black text-sm items-center flex flex-wrap">
                  {movieData.movie?.title.length > 27
                    ? `${movieData.movie.title.substring(0, 27)}...`
                    : movieData.movie?.title}{" "}
                  {/* {movieData.movie.title} */}
                </p>
                <span className="text-gray text-sm items-center">
                  {movieData.movie?.year}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
