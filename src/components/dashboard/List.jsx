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
      {/* <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 transition-all ease-in-out opacity-0 hover:opacity-100 hover:backdrop-brightness-105 hover:backdrop-blur-sm h-full text-white text-xl px-3 z-10"
      >
        &lt;
      </button> */}
      <ul
        // ref={listRef}
        className="flex justify-start items-start space-x-3 overflow-x-auto md:overflow-x-hidden h-full no-scrollbar"
      >
        {movies &&
          movies.map((movieData, index) => (
            <li key={index} className="flex flex-col space-y-3 w-32 md:w-48">
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
            </li>
          ))}
      </ul>
      {/* <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 z-10"
      >
        &gt;
      </button> */}
    </div>
  );
}
