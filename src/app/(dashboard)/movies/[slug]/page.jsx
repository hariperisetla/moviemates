"use client";

import Image from "next/image";
import { GoDotFill } from "react-icons/go";
import { setWatchedMovies } from "@/actions/setWatchedMovies";
import { getMovieDetails } from "@/actions/getMovieDetails";
import { useEffect, useState } from "react";

import { getHistory } from "@/actions/getHistory";
import { BiBookmark } from "react-icons/bi";
import { BsBookmark } from "react-icons/bs";
import { MdBookmarkAdd } from "react-icons/md";

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
        <div className="relative hidden md:flex w-full h-[15rem] md:h-[35rem] rounded-[2rem] md:rounded-[3rem] overflow-hidden">
          <div className="absolute h-[15rem] md:h-full w-full z-0">
            <div className="bg-gradient-to-t from-black from-10% to-transparent h-[15rem] md:h-[35rem] w-full absolute z-10 opacity-50"></div>
            <Image
              src={`https://image.tmdb.org/t/p/w1280${movie.landscapeImageUrl}`}
              alt={movie.title + " image"}
              fill
              className="object-cover object-top"
            />

            <div className="absolute shadow z-10 right-5 top-5 flex">
              {/* <span className="bg-primary/50 text-white rounded-l-2xl pl-3 items-center flex">
                <GoDotFill size={30} className="animate-pulse text-green-300" />
              </span>
              <select
                name=""
                id=""
                className="border-lightGray outline-none py-3 pr-3 bg-black/50 rounded-r-2xl text-white"
              >
                <option value="" selected>
                  Watched
                </option>
                <option value="">Not Watched</option>
              </select> */}
            </div>

            <div className="flex items-end h-full pb-8">
              <div className="md:text-left px-5 md:px-8 space-y-3 md:space-y-3 text-white z-20 text-center max-w-4xl">
                <div className="space-x-1 md:space-x-3 flex justify-center md:justify-start items-center md:items-start">
                  {movie.genres.map((genre, index) => (
                    <p
                      key={index}
                      className="capitalize flex items-center bg-white/30 shadow  rounded-[3rem] px-4 py-1"
                    >
                      {genre}
                      {/* {index !== movie.movie.genres.length - 1 && (
                      <span className="pl-1 md:pl-2">
                        <GoDotFill />
                      </span>
                    )} */}
                    </p>
                  ))}
                </div>
                <h2 className="pb-2 flex flex-wrap w-full text-2xl md:text-5xl font-bold">
                  {movie.title}
                </h2>
                {/* <p className="md:text-xl">
              In your <span className="underline">Next Watch</span> List
            </p> */}
                <div className="flex justify-start gap-2 md:gap-5 text-lg">
                  <p>{movie.year}</p>
                  <p>|</p>
                  <p>{runtime}</p>
                  <p>|</p>
                  <p>{movie.certification ? movie.certification : "N/A"}</p>
                </div>

                <div className="hidden md:flex justify-center md:justify-start items-center md:text-xl font-semibold gap-3">
                  <button
                    onClick={addWatched}
                    className="text-base md:text-xl text-primary border-2 border-secondary bg-secondary rounded-2xl md:rounded-3xl px-3 py-2 md:px-8 md:py-3"
                  >
                    Tell A Mate
                  </button>
                  <button
                    className={`${
                      isWatched
                        ? "border-2 border-green-500 bg-green-500/30"
                        : "border-2 border-secondary/50"
                    }  flex items-center gap-2 shadow-md text-white md:text-xl px-3 py-2 md:px-5 md:py-3 rounded-2xl md:rounded-3xl`}
                  >
                    {/* <span>
                      <BiBookmark size={25} />
                    </span> */}
                    <span>{isWatched ? "Watched" : "Mark as Watched"}</span>
                  </button>
                  <button
                    onClick={addWatched}
                    className="text-sm md:text-xl border-2 border-secondary/30 bg-secondary/30 rounded-3xl md:px-4 md:py-2"
                  >
                    <MdBookmarkAdd size={35} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {movie && (
        <div className="px-5 md:hidden relative h-[30rem] w-full rounded-3xl overflow-hidden">
          <Image
            src={`https://image.tmdb.org/t/p/w1280${movie.portraitImageUrl}`}
            alt={movie.title + " image"}
            fill
            className="object-cover object-center rounded-3xl"
          />
        </div>
      )}
      <div className="pt-3 space-y-5">
        {/* <div>
          <button
            onClick={addWatched}
            className={`md:text-xl ${
              isWatched ? "bg-green-500" : "bg-red-500"
            } px-5 py-2 rounded-md`}
          >
            {isWatched ? "Watched" : "Not Watched"}
          </button>
        </div> */}
        {/* <h1 className="text-primary text-2xl font-bold">
          {movie && movie.title}
        </h1> */}
        <div className="flex md:hidden justify-center md:justify-start items-center md:text-xl font-semibold gap-3">
          {/* <button
            onClick={addWatched}
            className="text-base md:text-xl text-primary border-2 border-secondary bg-secondary rounded-2xl md:rounded-3xl px-3 py-2 md:px-8 md:py-3"
          >
            Tell A Mate
          </button> */}
          <button
            className={`${
              isWatched
                ? "border-2 border-green-500 bg-green-500/30"
                : "border-2 border-secondary bg-secondary"
            }  flex justify-center items-center gap-2 w-full text-black/75 md:text-xl px-3 py-2 md:px-5 md:py-3 rounded-2xl md:rounded-3xl`}
          >
            {/* <span>
                      <BiBookmark size={25} />
                    </span> */}
            <span>{isWatched ? "Watched" : "Mark as Watched"}</span>
          </button>
          <button
            onClick={addWatched}
            className="flex justify-center w-full items-center md:text-xl border-2 border-primary bg-primary text-white rounded-2xl md:rounded-3xl px-2 py-2 md:px-4 md:py-2"
          >
            {/* <MdBookmarkAdd size={30} />  */}
            <span>Add to Watchlist</span>
          </button>
        </div>
        <p className="">{movie && movie.overview}</p>
        <p>{movie && movie.year}</p>
      </div>
    </div>
  );
}
