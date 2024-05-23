"use client";

import Image from "next/image";
import { GoDotFill } from "react-icons/go";
import { setWatchedMovies } from "@/actions/setWatchedMovies";
import { getMovieDetails } from "@/actions/getMovieDetails";
import { useEffect, useState } from "react";

import { getHistory } from "@/actions/getHistory";

export default function MovieDetails({ params }) {
  const [movie, setMovie] = useState();
  const [isWatched, setIsWatched] = useState(false);

  useEffect(() => {
    async function fetchMovieDetails() {
      let data = await getMovieDetails(params.slug);

      setMovie(data);

      if (data && data.ids && data.ids.trakt) {
        const history = await getHistory(data.ids.trakt);
        const watched =
          history &&
          history.some((entry) => entry.movie.ids.trakt === data.ids.trakt);
        setIsWatched(watched);
      }
    }

    fetchMovieDetails();
  }, [params.slug]);

  async function addWatched() {
    try {
      await setWatchedMovies(movie);
      // Check if the movie was already marked as watched in the backend
      const history = await getHistory(movie.ids.trakt);
      const watched = history.some(
        (entry) => entry.movie.ids.trakt === movie.ids.trakt
      );
      setIsWatched(watched);
    } catch (error) {
      console.error("Error marking movie as watched:", error);
    }
  }

  // Convert runtime to hours and minutes
  const hours = Math.floor(movie?.runtime / 60);
  const minutes = movie?.runtime % 60;
  const runtime = `${hours}h ${minutes}m`;

  return (
    <div className="movie-details ">
      {movie && (
        <div className="relative w-full h-[33rem] md:h-[35rem] rounded-3xl overflow-hidden">
          {/* <div className="bg-transparent h-[31rem] md:h-[35rem] w-full absolute z-10 opacity-80"></div> */}
          <Image
            src={`https://image.tmdb.org/t/p/w1280${movie.landscapeImageUrl}`}
            alt={movie.title}
            fill
            className="object-cover object-top blur"
          />

          <div className="container grid md:grid-cols-5 max-w-7xl gap-3 md:gap-52 md:h-full items-center mx-auto justify-center">
            <div className="w-48 md:w-64 h-64 md:h-96 relative z-20 rounded-3xl overflow-hidden hidden md:flex shadow">
              <Image
                src={`https://image.tmdb.org/t/p/w1280${movie.portraitImageUrl}`}
                alt={movie.title + " image"}
                fill
                className="object-cover object-top"
              />
            </div>

            {/* For mobile */}
            <div className="w-full md:hidden justify-center items-center flex md:pt-0 pt-5">
              <div className="w-48 md:w-64 h-64 md:h-96 relative z-20 rounded-3xl overflow-hidden">
                <Image
                  src={`https://image.tmdb.org/t/p/w1280${movie.portraitImageUrl}`}
                  alt={movie.title + " image"}
                  fill
                  className="object-cover object-top"
                />
              </div>
            </div>

            <div className="md:col-span-4 md:text-left px-5 md:px-0 space-y-3 md:space-y-8 text-white z-20 text-center">
              <h2 className="font-libreBaskerville pb-2 text-2xl flex-wrap md:text-5xl">
                {movie.title}
              </h2>
              <p className="md:text-xl">
                In your <span className="underline">Next Watch</span> List
              </p>
              <div className="flex flex-row justify-center md:justify-start gap-2 md:gap-5 text-sm md:text-base">
                <p>{runtime}</p>
                <div className="space-x-1 md:space-x-3 flex justify-center md:justify-start items-center md:items-start">
                  {movie.genres.map((genre, index) => (
                    <p key={index} className="capitalize flex items-center">
                      {genre}
                      {index !== movie.genres.length - 1 && (
                        <span className="pl-1 md:pl-2">
                          <GoDotFill />
                        </span>
                      )}
                    </p>
                  ))}
                </div>{" "}
                <p>{movie.certification ? movie.certification : "N/A"}</p>
              </div>

              <div className="flex justify-center md:justify-start items-center md:text-xl font-semibold gap-5">
                <button className="bg-secondary shadow text-primary px-5 py-2 rounded-md">
                  Tell A Mate
                </button>{" "}
                <button className="underline md:text-xl">
                  Remove from List
                </button>
              </div>

              <div>
                <button
                  onClick={addWatched}
                  className={`md:text-xl ${
                    isWatched ? "bg-green-500" : "bg-red-500"
                  } px-5 py-2 rounded-md`}
                >
                  {isWatched ? "Watched" : "Not Watched"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="px-5 pt-3 space-y-5">
        <h1 className="text-indigo-600 text-2xl font-bold">
          {movie && movie.title}
        </h1>
        <p className="">{movie && movie.overview}</p>
        <p>{movie && movie.year}</p>
      </div>
    </div>
  );
}
