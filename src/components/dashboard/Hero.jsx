"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MdBookmarkAdd, MdBookmarkAdded } from "react-icons/md";
import { setWatchlistMovies } from "@/actions/setWatchlistMovies";
import { getWatchlistMovies } from "@/actions/getWatchlistMovies";
import { getTrendingMovies } from "@/actions/getTrendingMovies";

import { useRouter } from "next/navigation";
import { IoIosAddCircle, IoIosAddCircleOutline, IoMdAdd } from "react-icons/io";
import { IoAdd, IoAddCircleOutline } from "react-icons/io5";

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
    <div className="relative h-[17rem] md:h-[35rem] w-full md:rounded-[3rem] overflow-hidden">
      {movies &&
        movies.map((movie, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 space-y-2 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="relative h-[13rem] rounded-3xl overflow-hidden md:h-full w-full">
              <Link href={`/movies/${movie.movie.ids.slug}`} key={index}>
                <div className="bg-gradient-to-t from-black from-10% to-transparent h-[13rem] md:h-[35rem] w-full absolute z-10 opacity-50"></div>
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
                <div className="md:text-left px-3 w-full md:px-8 space-y-2 md:space-y-3 text-white z-20 text-center">
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

                  <div className="hidden md:flex z-20 w-full justify-center md:justify-start items-center text-sm md:text-xl font-semibold gap-3 pb-3">
                    <button className="text-secondary shadow-md w-full md:w-auto border-2 border-primary bg-primary rounded-2xl md:rounded-3xl px-3 py-2 md:px-8 md:py-3">
                      Tell A Mate
                    </button>
                    <button className="border-2 hidden md:flex border-secondary/50 w-full md:w-auto items-center gap-2 shadow-md text-white md:text-xl px-3 py-2 md:px-5 md:py-3 rounded-2xl md:rounded-3xl">
                      <span>Mark as Watched</span>
                    </button>

                    <button className="text-3xl text-primary bg-secondary rounded-3xl p-2">
                      {/* <IoAddCircleOutline /> */}

                      <IoMdAdd />
                    </button>
                    <button
                      onClick={() => handleUpdateWatchlist(movie)}
                      className={`${
                        movie.isInWatchlist
                          ? "bg-primary/30"
                          : "bg-secondary/30"
                      } hidden md:flex text-3xl md:text-4xl border-2 border-secondary/30 rounded-3xl md:px-4 md:py-2`}
                    >
                      {/* {console.log(movie)} */}
                      {movie.isInWatchlist ? (
                        <MdBookmarkAdded />
                      ) : (
                        <MdBookmarkAdd />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex z-20 w-full justify-center md:justify-start items-center md:text-xl font-semibold gap-2 md:gap-3 pb-3">
              <button className="text-secondary w-full md:w-auto border-2 border-primary bg-primary rounded-2xl md:rounded-3xl px-3 py-2 md:px-8 md:py-3">
                Tell A Mate
              </button>
              <button className="border-2 hidden md:flex border-secondary/50 w-full md:w-auto items-center gap-2 shadow-md text-white md:text-xl px-3 py-2 md:px-5 md:py-3 rounded-2xl md:rounded-3xl">
                <span>Mark as Watched</span>
              </button>

              <button className="text-3xl p-2 text-primary bg-secondary rounded-2xl">
                {/* <IoAddCircleOutline /> */}

                <IoMdAdd />
              </button>
              <button
                onClick={() => handleUpdateWatchlist(movie)}
                className={`${
                  movie.isInWatchlist ? "bg-primary/30" : "bg-secondary/30"
                } hidden md:flex text-3xl md:text-4xl border-2 border-secondary/30 rounded-3xl md:px-4 md:py-2`}
              >
                {/* {console.log(movie)} */}
                {movie.isInWatchlist ? <MdBookmarkAdded /> : <MdBookmarkAdd />}
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}
