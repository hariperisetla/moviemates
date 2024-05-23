"use client";

import { getWishlistMovies } from "@/actions/getWishlistMovies";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function WatchList() {
  const [movies, setMovies] = useState();

  useEffect(() => {
    async function fetchList() {
      let moviesList = await getWishlistMovies();

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
            <Link
              href={`/movies/${movieData.movie?.ids.slug}`}
              key={index}
              className="relative rounded-xl overflow-hidden w-full md:w-56"
            >
              <div className="relative w-full h-72 rounded-t-xl overflow-hidden">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movieData.imageUrl}`}
                  alt={movieData.movie?.title}
                  fill
                  className="object-cover object-center"
                />
              </div>
              <div className="w-full z-10 bg-gradient-to-br from-primary to-secondary backdrop-blur-md py-2 rounded-b-xl overflow-hidden">
                <p className="px-3 text-white text-xs items-center flex flex-wrap">
                  {movieData.movie?.title.length > 29
                    ? `${movieData.movie.title.substring(0, 28)}...`
                    : movieData.movie?.title}{" "}
                  {/* {movieData.movie.title} */}
                </p>
                <span className="px-3 text-white text-xs items-center">
                  {movieData.movie?.year}
                </span>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
