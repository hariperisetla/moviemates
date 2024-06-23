import { getTrendingMovies } from "@/actions/getTrendingMovies";
import { watch } from "fs";
import { cookies } from "next/headers";
import Image from "next/image";
import React from "react";
import { GoDotFill } from "react-icons/go";
import { MdBookmarkAdd } from "react-icons/md";

async function getData() {
  const access_token = cookies().get("access_token").value;
  try {
    const response = await fetch(
      `https://api.trakt.tv/sync/watchlist/movies?limit=1&extended=full`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
          "trakt-api-version": 2,
          "trakt-api-key": process.env.CLIENT_ID,
        },
      }
    );

    let movieData;

    const watchList = await response.json();

    if (watchList.length === 0) {
      // Fetch trending movies as fallback
      const trendingMovies = await getTrendingMovies(1, 1);

      // Assuming getTrendingMovies returns an array of movies
      const trendingMovie = trendingMovies[0].movie.ids.tmdb;

      // Fetch images for the trending movie from TMDB
      const imageResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${trendingMovie}/images`,
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.TMDB_ID}`,
          },
        }
      );

      const imageData = await imageResponse.json();

      // Get images URLs
      const portraitImages = imageData.posters;
      const landscapeImages = imageData.backdrops;

      movieData = {
        movie: trendingMovies[0].movie,
        portraitImageUrl:
          portraitImages.length > 0 ? portraitImages[0].file_path : null,
        landscapeImageUrl:
          landscapeImages.length > 0 ? landscapeImages[0].file_path : null,
      };
    } else {
      // Extract movie ID from watchlist
      const movieId = watchList[0].movie.ids.tmdb;

      // Fetch images for the movie from TMDB
      const imageResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/images`,
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.TMDB_ID}`,
          },
        }
      );

      const imageData = await imageResponse.json();

      // Get images URLs
      const portraitImages = imageData.posters;
      const landscapeImages = imageData.backdrops;

      movieData = {
        movie: watchList[0].movie,
        portraitImageUrl:
          portraitImages.length > 0 ? portraitImages[0].file_path : null,
        landscapeImageUrl:
          landscapeImages.length > 0 ? landscapeImages[0].file_path : null,
      };
    }

    return movieData;
  } catch (error) {
    console.log("Error fetching watchlist: " + error);
    return null;
  }
}

export default async function Hero() {
  const movie = await getData();

  console.log(movie.movie);

  // Convert runtime to hours and minutes
  const hours = Math.floor(movie.movie.runtime / 60);
  const minutes = movie.movie.runtime % 60;
  const runtime = `${hours}h ${minutes}m`;

  return (
    <div className="relative h-[15rem] md:h-[35rem] w-full rounded-3xl md:rounded-[3rem] overflow-hidden">
      <div className="absolute h-[15rem] md:h-[35rem] w-full z-0">
        <div className="bg-gradient-to-t from-black from-10% to-transparent h-[15rem] md:h-[35rem] w-full absolute z-10 opacity-50"></div>
        <Image
          src={`https://image.tmdb.org/t/p/w1280${movie.landscapeImageUrl}`}
          alt={movie.movie.title + " image"}
          fill
          className="object-cover object-top"
        />
        <div className="flex items-end w-full md:w-auto h-full pb-3 md:pb-8">
          <div className="md:text-left px-5 md:px-8 space-y-2 md:space-y-3 text-white z-20 text-center">
            <div className="space-x-1 md:space-x-3 hidden md:flex justify-center md:justify-start items-center md:items-start">
              {movie.movie.genres.map((genre, index) => (
                <p
                  key={index}
                  className="capitalize text-sm md:text-base flex items-center bg-white/30 shadow  rounded-[3rem] px-4 py-1"
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
            <h2 className="md:pb-2 text-2xl text-left flex-wrap md:text-5xl font-bold">
              {movie.movie.title}
            </h2>
            <div className="space-x-1 md:space-x-3 flex justify-start md:justify-start items-start md:items-start">
              {movie.movie.genres.map((genre, index) => (
                <p
                  key={index}
                  className="capitalize text-sm md:text-base flex items-center shadow  rounded-[3rem] px-1"
                >
                  {genre}
                  {index !== movie.movie.genres.length - 1 && ","}
                </p>
              ))}
            </div>
            {/* <p className="md:text-xl">
              In your <span className="underline">Next Watch</span> List
            </p> */}
            <div className="hidden md:flex justify-start gap-2 md:gap-5 text-sm md:text-lg">
              <p>{movie.movie.year}</p>
              <p>|</p>
              <p>{runtime}</p>
              <p>|</p>
              <p>
                {movie.movie.certification ? movie.movie.certification : "N/A"}
              </p>
            </div>

            <div className="flex w-full justify-center md:justify-start items-center text-sm md:text-xl font-semibold gap-3">
              <button className="text-primary w-full md:w-auto border-2 border-secondary bg-secondary rounded-2xl md:rounded-3xl px-3 py-2 md:px-8 md:py-3">
                Tell A Mate
              </button>
              <button
                className={`${
                  false
                    ? "border-2 border-green-500 bg-green-500/30"
                    : "border-2 border-secondary/50"
                } w-full md:w-auto flex items-center gap-2 shadow-md text-white md:text-xl px-3 py-2 md:px-5 md:py-3 rounded-2xl md:rounded-3xl`}
              >
                {/* <span>
                      <BiBookmark size={25} />
                    </span> */}
                <span>Mark as Watched</span>
              </button>
              {/* <button className="text-sm md:text-xl border-2 border-secondary/30 bg-secondary/30 rounded-3xl md:px-4 md:py-2">
                <MdBookmarkAdd size={35} />
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
