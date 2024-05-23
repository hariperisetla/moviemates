"use client";

import Image from "next/image";
import Link from "next/link";
import { getWishlistMovies } from "@/actions/getWishlistMovies";
import { getTrendingMovies } from "@/actions/getTrendingMovies";
import { useEffect, useRef, useState } from "react";

export default function VerticalItemsList({ type }) {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState();

  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;

    const onWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        scrollContainer.scrollLeft += e.deltaY;
      }
    };

    if (scrollContainer) {
      scrollContainer.addEventListener("wheel", onWheel);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("wheel", onWheel);
      }
    };
  }, []);

  useEffect(() => {
    async function fetchMovies(type) {
      setLoading(true);

      let newMovies = [];

      switch (type) {
        case "watchlist":
          newMovies = await getWishlistMovies();
          break;
        case "trending":
          newMovies = await getTrendingMovies();
      }

      setMovies(newMovies);

      setLoading(false);
    }

    fetchMovies(type);
  }, [type]);

  return (
    <div className="relative h-[23rem]">
      <ul ref={scrollRef} className="flex space-x-4 overflow-x-auto h-full">
        {movies &&
          movies.map((movieData, index) => (
            <li key={index} className="flex-shrink-0 w-52">
              <Link
                href={`/movies/${movieData.movie?.ids.slug}`}
                key={index}
                className="relative pb-10 rounded-xl overflow-hidden w-64"
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
            </li>
          ))}
      </ul>
    </div>
  );
}
