"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { getTrendingMovies } from "@/actions/getTrendingMovies";

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const loader = useRef(null);

  useEffect(() => {
    async function fetchMovies() {
      setLoading(true);
      const newMovies = await getTrendingMovies(page);
      console.log(newMovies);
      if (newMovies) setMovies((prevMovies) => [...prevMovies, ...newMovies]);

      setLoading(false);
    }

    fetchMovies();
  }, [page]);

  useEffect(() => {
    const observerCallback = (entries) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 1.0,
    });

    const currentLoader = loader.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, []);

  return (
    <div className="space-y-3 pt-3 items-center w-full text-center">
      <h1 className="text-2xl text-indigo-600">Trending Movies</h1>
      <ul className="grid grid-cols-2 md:grid-cols-8 gap-3 px-3">
        {movies &&
          movies.map((movieData, index) => (
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

      {loading && <p>Loading...</p>}
      <div ref={loader} className="h-10"></div>
    </div>
  );
}
