"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";

export default function List({ movies }) {
  const listRef = useRef(null);

  const scrollLeft = () => {
    if (listRef.current) {
      const width = listRef.current.clientWidth;
      listRef.current.scrollBy({
        left: -width,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (listRef.current) {
      const width = listRef.current.clientWidth;
      listRef.current.scrollBy({
        left: width,
        behavior: "smooth",
      });
    }
  };

  return (
    <div>
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 transition-all ease-in-out opacity-0 hover:opacity-100 hover:backdrop-brightness-105 hover:backdrop-blur-sm h-full text-white text-xl px-3 z-10"
      >
        &lt;
      </button>
      <ul
        ref={listRef}
        className="flex space-x-4 overflow-x-hidden h-full items-center"
      >
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
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 z-10"
      >
        &gt;
      </button>
    </div>
  );
}
