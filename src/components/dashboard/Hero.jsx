import { cookies } from "next/headers";
import Image from "next/image";
import React from "react";
import { GoDotFill } from "react-icons/go";

async function getData() {
  try {
    const access_token = cookies().get("access_token").value;

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

    const watchList = await response.json();

    const movieId = watchList[0].movie.ids.tmdb;

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

    const portraitImages = imageData.posters;
    const landscapeImages = imageData.backdrops;

    const movieWithImages = {
      ...watchList[0],
      portraitImageUrl:
        portraitImages.length > 0 ? portraitImages[0].file_path : null,
      landscapeImageUrl:
        landscapeImages.length > 0 ? landscapeImages[0].file_path : null,
    };

    return movieWithImages;
  } catch (error) {
    console.log("Error fetching watchlist: " + error);
    return null;
  }
}

export default async function Hero() {
  const movie = await getData();

  // Convert runtime to hours and minutes
  const hours = Math.floor(movie.movie.runtime / 60);
  const minutes = movie.movie.runtime % 60;
  const runtime = `${hours}h ${minutes}m`;

  return (
    <div className="relative h-[31rem] md:h-[35rem] w-full rounded-3xl overflow-hidden">
      <div className="absolute h-[35rem] w-full z-0">
        <div className="bg-gradient-to-br from-primary from-60% to-secondary h-[31rem] md:h-[35rem] w-full absolute z-10 opacity-80"></div>
        <Image
          src={`https://image.tmdb.org/t/p/w1280${movie.landscapeImageUrl}`}
          alt={movie.movie.title + " image"}
          fill
          className="object-cover object-top opacity-100 blur"
        />
        <div className="container grid md:grid-cols-5 max-w-7xl gap-3 md:gap-52 md:h-full items-center mx-auto justify-center">
          <div className="w-48 md:w-64 h-64 md:h-96 relative z-20 rounded-3xl overflow-hidden hidden md:flex">
            <Image
              src={`https://image.tmdb.org/t/p/w1280${movie.portraitImageUrl}`}
              alt={movie.movie.title + " image"}
              fill
              className="object-cover object-top"
            />
          </div>

          {/* For mobile */}
          <div className="w-full md:hidden justify-center items-center flex md:pt-0 pt-5">
            <div className="w-48 md:w-64 h-64 md:h-96 relative z-20 rounded-3xl overflow-hidden">
              <Image
                src={`https://image.tmdb.org/t/p/w1280${movie.portraitImageUrl}`}
                alt={movie.movie.title + " image"}
                fill
                className="object-cover object-top"
              />
            </div>
          </div>

          <div className="md:col-span-4 md:text-left px-5 md:px-0 space-y-3 md:space-y-8 text-white z-20 text-center">
            <h2 className="font-libreBaskerville pb-2 text-2xl flex-wrap md:text-5xl">
              {movie.movie.title}
            </h2>
            <p className="md:text-xl">
              In your <span className="underline">Next Watch</span> List
            </p>
            <div className="flex flex-row justify-center md:justify-start gap-2 md:gap-5 text-sm md:text-base">
              <p>{runtime}</p>
              <div className="space-x-1 md:space-x-3 flex justify-center md:justify-start items-center md:items-start">
                {movie.movie.genres.map((genre, index) => (
                  <p key={index} className="capitalize flex items-center">
                    {genre}
                    {index !== movie.movie.genres.length - 1 && (
                      <span className="pl-1 md:pl-2">
                        <GoDotFill />
                      </span>
                    )}
                  </p>
                ))}
              </div>{" "}
              <p>
                {movie.movie.certification ? movie.movie.certification : "N/A"}
              </p>
            </div>

            <div className="flex justify-center md:justify-start items-center md:text-xl font-semibold gap-5">
              <button className="bg-secondary shadow text-primary px-5 py-2 rounded-md">
                Tell A Mate
              </button>{" "}
              <button className="underline md:text-xl">Remove from List</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
