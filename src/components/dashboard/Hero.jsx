"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MdBookmarkAdd, MdBookmarkAdded } from "react-icons/md";
import { setWatchlistMovies } from "@/actions/setWatchlistMovies";
import { getWatchlistMovies } from "@/actions/getWatchlistMovies";
import { getTrendingMovies } from "@/actions/getTrendingMovies";

import { useRouter } from "next/navigation";

export default function Hero() {
  const [movies, setMovies] = useState([]);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);

  let interval = 5000;

  const [currentIndex, setCurrentIndex] = useState(0);
  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? movies.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === movies.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, interval);
    return () => clearInterval(slideInterval);
  }, [currentIndex, interval]);

  const router = useRouter();

  // Function to fetch movies
  async function fetchMovies() {
    try {
      let moviesData;

      ("use server");
      async function getMovieData() {
        let moviesData = await getWatchlistMovies(5);

        if (moviesData.length === 0) {
          moviesData = await getTrendingMovies(undefined, 5);
        } else {
          // Mark movies in watchlist with isInWatchlist = true
          moviesData = moviesData.map((movie) => ({
            ...movie,
            isInWatchlist: true,
          }));
        }

        return moviesData;
      }

      moviesData = await getMovieData();

      console.log(moviesData);

      setMovies(moviesData);

      const interval = setInterval(() => {
        setCurrentMovieIndex((prevIndex) =>
          prevIndex === moviesData.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  }

  // Fetch movies on component mount
  useEffect(() => {
    fetchMovies();
  }, []);

  if (movies.length === 0) {
    return <div>Loading...</div>;
  }

  // const movie = movies[currentMovieIndex];

  function getRuntime(time) {
    // Convert runtime to hours and minutes
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    const runtime = `${hours}h ${minutes}m`;

    return runtime;
  }

  async function handleUpdateWatchlist(movie) {
    try {
      const updatedMovies = movies.map((m) =>
        m.movie.ids.trakt === movie.movie.ids.trakt
          ? { ...m, isInWatchlist: !m.isInWatchlist }
          : m
      );

      if (movie.isInWatchlist) {
        // Remove from watchlist
        await setWatchlistMovies(movie.movie.ids.trakt);
        // Check if movies will be empty after removal
        if (updatedMovies.length === 1) {
          const newMoviesData = await getTrendingMovies(undefined, 3);
          setMovies(newMoviesData);
        } else {
          setMovies(updatedMovies);
        }
      } else {
        // Add to watchlist
        await setWatchlistMovies(movie.movie.ids.trakt);
        setMovies(updatedMovies);
      }

      router.refresh();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="relative h-[15rem] md:h-[35rem] w-full rounded-3xl md:rounded-[3rem] overflow-hidden">
      <div className="relative h-64 md:h-full">
        {movies &&
          movies.map((movie, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <Link href={`/movies/${movie.movie.ids.slug}`} key={index}>
                <div className="bg-gradient-to-t from-black from-10% to-transparent h-[15rem] md:h-[35rem] w-full absolute z-10 opacity-50"></div>
                <Image
                  src={`https://image.tmdb.org/t/p/w1280${
                    movie.landscapeImageUrl
                      ? movie.landscapeImageUrl
                      : movie.portraitImageUrl
                  }`}
                  alt={movie.movie.title + " image"}
                  fill
                  className={`object-cover ${
                    movie.landscapeImageUrl ? "object-top" : "object-center"
                  }`}
                />
              </Link>
              <div className="flex items-end w-full md:w-auto h-full pb-3 md:pb-8">
                <div className="md:text-left px-5 md:px-8 space-y-2 md:space-y-3 text-white z-20 text-center">
                  <Link
                    href={`/movies/${movie.movie.ids.slug}`}
                    className="space-y-2 md:space-y-3"
                  >
                    <div className="space-x-1 md:space-x-3 hidden md:flex justify-center md:justify-start items-center md:items-start">
                      {movie.movie.genres.map((genre, index) => (
                        <p
                          key={index}
                          className="capitalize text-sm md:text-base flex items-center bg-white/30 shadow  rounded-[3rem] px-4 py-1"
                        >
                          {genre}
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
                    <div className="hidden md:flex justify-start gap-2 md:gap-5 text-sm md:text-lg">
                      <p>{movie.movie.year}</p>
                      <p>|</p>
                      <p>{getRuntime(movie.movie.runtime)}</p>
                      <p>|</p>
                      <p>
                        {movie.movie.certification
                          ? movie.movie.certification
                          : "N/A"}
                      </p>
                    </div>
                  </Link>

                  <div className="flex z-20 w-full justify-center md:justify-start items-center text-sm md:text-xl font-semibold gap-3">
                    <button className="text-primary w-full md:w-auto border-2 border-secondary bg-secondary rounded-2xl md:rounded-3xl px-3 py-2 md:px-8 md:py-3">
                      Tell A Mate
                    </button>
                    <button className="border-2 border-secondary/50 w-full md:w-auto flex items-center gap-2 shadow-md text-white md:text-xl px-3 py-2 md:px-5 md:py-3 rounded-2xl md:rounded-3xl">
                      <span>Mark as Watched</span>
                    </button>
                    <button
                      onClick={() => handleUpdateWatchlist(movie)}
                      className={`${
                        movie.isInWatchlist
                          ? "bg-primary/30"
                          : "bg-secondary/30"
                      }  text-sm md:text-xl border-2 border-secondary/30  rounded-3xl md:px-4 md:py-2`}
                    >
                      {/* {console.log(movie)} */}
                      {movie.isInWatchlist ? (
                        <MdBookmarkAdded size={35} />
                      ) : (
                        <MdBookmarkAdd size={35} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* <button
        type="button"
        onClick={prevSlide}
        class="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        data-carousel-prev
      >
        <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          <svg
            class="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 1 1 5l4 4"
            />
          </svg>
          <span class="sr-only">Previous</span>
        </span>
      </button>
      <button
        type="button"
        onClick={nextSlide}
        class="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        data-carousel-next
      >
        <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          <svg
            class="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
          <span class="sr-only">Next</span>
        </span>
      </button> */}
    </div>
  );
}
