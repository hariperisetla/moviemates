"use client";

import Image from "next/image";
import { GoDotFill } from "react-icons/go";
import { setWatchedMovies } from "@/actions/setWatchedMovies";
import { getMovieDetails } from "@/actions/getMovieDetails";
import { useEffect, useState } from "react";

import { getHistory } from "@/actions/getHistory";
import { BiBookmark } from "react-icons/bi";
import { BsBookmark } from "react-icons/bs";
import { MdBookmarkAdd, MdBookmarkAdded } from "react-icons/md";

import { getPersons } from "@/actions/getPersons";
import { IoIosArrowBack, IoIosArrowForward, IoMdAdd } from "react-icons/io";
import { IoPerson } from "react-icons/io5";

import TraktLogo from "@/assets/trakt-icon-red.svg";
import IMDBLogo from "@/assets/IMDB.svg";
import RottenTomatoesLogo from "@/assets/Rotten_Tomatoes.png";
import TMDBLogo from "@/assets/Tmdb.new.logo.png";
import MetacriticLogo from "@/assets/Metacritic_M.png";

import BottomSheet from "@/components/dashboard/BottomSheet";

import { setWatchlistMovies } from "@/actions/setWatchlistMovies";

export default function MovieDetails({ params }) {
  const [movie, setMovie] = useState();
  const [person, setPerson] = useState();

  const [startIndex, setStartIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(7); // Number of persons to display at a time
  const [isWatched, setIsWatched] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  const [bottomSheet, setBottomSheet] = useState(false);
  const [statusFlag, setStatusFlag] = useState(false);

  useEffect(() => {
    async function fetchMovieDetails() {
      try {
        const movieData = await getMovieDetails(params.slug);
        const personsData = await getPersons(params.slug);

        setMovie(movieData);
        setPerson(personsData);

        if (movieData && movieData.ids && movieData.ids.trakt) {
          const history = await getHistory(movieData.ids.trakt);
          const watched = history.some(
            (entry) => entry.movie.ids.trakt === movieData.ids.trakt
          );
          setIsWatched(watched);
        }

        // Check if movie is in watchlist
        // Assuming movie.isInWatchlist is set in getMovieDetails or needs to be checked separately
        setIsInWatchlist(movieData.isInWatchlist || false);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    }

    fetchMovieDetails();

    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setItemsPerPage(7);
      } else if (window.innerWidth >= 1024) {
        setItemsPerPage(5);
      } else if (window.innerWidth >= 768) {
        setItemsPerPage(4);
      } else {
        setItemsPerPage(5);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
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

  const handleUpdateWatchlist = async (movieId) => {
    try {
      await setWatchlistMovies(movieId);
      setIsInWatchlist((prev) => !prev); // Toggle the isInWatchlist state
    } catch (error) {
      console.error("Error updating watchlist:", error);
    }
  };

  const handleForward = () => {
    setStartIndex((prevIndex) =>
      Math.min(prevIndex + itemsPerPage, person.length)
    );
  };

  const handleBackward = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - itemsPerPage, 0));
  };
  const displayedPersons = person?.slice(startIndex, startIndex + itemsPerPage);

  const handleMovieStatus = () => {
    setBottomSheet(!bottomSheet);
    setStatusFlag("status");
  };

  return (
    <div className="relative movie-details pb-10">
      {movie && (
        <div className="relative hidden md:flex w-full h-[15rem] md:h-[35rem] rounded-[2rem] md:rounded-[3rem] overflow-hidden">
          <div className="absolute h-[15rem] md:h-full w-full z-0">
            <div className="bg-gradient-to-t from-black from-10% to-transparent h-[15rem] md:h-[35rem] w-full absolute z-10 opacity-50"></div>

            <Image
              src={`https://image.tmdb.org/t/p/w1280${
                movie.landscapeImageUrl
                  ? movie.landscapeImageUrl
                  : movie.portraitImageUrl
              }`}
              alt={movie.title + " image"}
              fill
              priority={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`object-cover ${
                movie.landscapeImageUrl ? "object-top" : "object-center"
              }`}
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
                    onClick={() => handleUpdateWatchlist(movie.ids.trakt)}
                    className={`${
                      isInWatchlist ? "bg-primary/30" : "bg-secondary/30"
                    } text-sm md:text-xl border-2 border-secondary/30  rounded-3xl md:px-4 md:py-2`}
                  >
                    {isInWatchlist ? (
                      <MdBookmarkAdded size={35} />
                    ) : (
                      <MdBookmarkAdd size={35} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full flex gap-3">
        {movie ? (
          <div className="px-5 md:hidden relative h-[25rem] w-full rounded-3xl overflow-hidden">
            <Image
              src={`https://image.tmdb.org/t/p/w1280${movie.portraitImageUrl}`}
              alt={movie.title + " image"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover object-center rounded-3xl"
            />
          </div>
        ) : (
          <div className="h-[25rem] w-full bg-secondary animate-pulse rounded-3xl"></div>
        )}

        <div className="grid gap-2 md:hidden">
          <div className="flex relative justify-center flex-col items-center bg-black rounded-2xl p-2">
            <p className="text-xl text-white font-semibold">7.5</p>
            <Image
              src={TraktLogo}
              alt="trakt"
              width={30}
              height={30}
              className=""
            />
          </div>
          <div className="flex relative justify-center flex-col items-center bg-yellow-400 rounded-2xl p-2">
            <p className="text-xl font-semibold">7.5</p>
            <Image
              src={IMDBLogo}
              alt="trakt"
              width={50}
              height={50}
              className=""
            />
          </div>
          <div className="flex relative justify-center flex-col items-center bg-sky-900 rounded-2xl p-2">
            <p className="text-xl text-white font-semibold">7.5</p>
            <Image
              src={TMDBLogo}
              alt="trakt"
              width={30}
              height={30}
              className=""
            />
          </div>
          <div className="flex relative justify-center flex-col items-center bg-zinc-200 rounded-2xl p-2">
            <p className="text-xl font-semibold">7.5</p>
            <Image
              src={RottenTomatoesLogo}
              alt="trakt"
              width={30}
              height={30}
              className=""
            />
          </div>
          <div className="flex relative justify-center flex-col items-center bg-black rounded-2xl p-2">
            <p className="text-xl text-white font-semibold">7.5</p>
            <Image
              src={MetacriticLogo}
              alt="trakt"
              width={30}
              height={30}
              className=""
            />
          </div>
        </div>

        <div className="hidden md:flex flex-col space-y-2">
          <button
            onClick={() => handleMovieStatus()}
            className="text-3xl p-2 text-primary bg-secondary rounded-2xl"
          >
            {/* <IoAddCircleOutline /> */}

            <IoMdAdd />
          </button>
          <button
            onClick={() => handleMovieStatus()}
            className="text-3xl p-2 text-primary bg-secondary rounded-2xl"
          >
            {/* <IoAddCircleOutline /> */}

            <IoMdAdd />
          </button>
          <button
            onClick={() => handleMovieStatus()}
            className="text-3xl p-2 text-primary bg-secondary rounded-2xl"
          >
            {/* <IoAddCircleOutline /> */}

            <IoMdAdd />
          </button>
          <button
            onClick={() => handleMovieStatus()}
            className="text-3xl p-2 text-primary bg-secondary rounded-2xl"
          >
            {/* <IoAddCircleOutline /> */}

            <IoMdAdd />
          </button>
        </div>
      </div>
      <div className="pt-3 space-y-8">
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
        <div className="flex z-20 w-full justify-center md:justify-start items-center md:text-xl font-semibold gap-2 md:gap-3 pb-3">
          <button
            onClick={() => {
              setBottomSheet(!bottomSheet);
              setStatusFlag("mate");
            }}
            className="text-secondary w-full md:w-auto border-2 border-primary bg-primary rounded-2xl md:rounded-3xl px-3 py-2 md:px-8 md:py-3"
          >
            Tell A Mate
          </button>
          <button className="border-2 hidden md:flex border-secondary/50 w-full md:w-auto items-center gap-2 shadow-md text-white md:text-xl px-3 py-2 md:px-5 md:py-3 rounded-2xl md:rounded-3xl">
            <span>Mark as Watched</span>
          </button>

          <button
            onClick={() => handleMovieStatus()}
            className="text-3xl px-3 py-2 text-primary bg-secondary rounded-2xl"
          >
            <IoMdAdd />
          </button>
          <button
            onClick={() => handleUpdateWatchlist(movie)}
            className={`${
              isWatched ? "bg-primary/30" : "bg-secondary/30"
            } hidden md:flex text-3xl md:text-4xl border-2 border-secondary/30 rounded-3xl md:px-4 md:py-2`}
          >
            {/* {console.log(movie)} */}
            {isWatched ? <MdBookmarkAdded /> : <MdBookmarkAdd />}
          </button>
        </div>
        <div className="space-y-3">
          <h3 className="text-xl text-primary font-bold">Description</h3>
          {movie ? (
            <p className="">{movie.overview}</p>
          ) : (
            <div className="space-y-2 animate-pulse">
              <p className="bg-secondary/50 rounded-md w-full h-5"></p>
              <p className="bg-secondary/50 rounded-md w-full h-5"></p>
              <p className="bg-secondary/50 rounded-md w-full h-5"></p>
              <p className="bg-secondary/50 rounded-md w-full h-5"></p>
              <p className="bg-secondary/50 rounded-md w-2/3 h-5"></p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="justify-between flex">
            <h3 className="text-xl text-primary font-bold">Cast</h3>
            <div className="hidden md:flex text-3xl text-gray gap-3">
              <button
                className="border rounded-full border-lightGray outline-none"
                onClick={handleBackward}
              >
                <IoIosArrowBack />
              </button>
              <button
                className="border rounded-full border-lightGray outline-none disabled:bg-lightGray"
                onClick={handleForward}
                disabled={displayedPersons?.length < itemsPerPage}
              >
                <IoIosArrowForward />
              </button>
            </div>
          </div>
          <div
            className={`hidden md:flex md:flex-wrap gap-2 md:gap-7 md:overflow-hidden ${
              displayedPersons?.length < itemsPerPage
                ? "justify-start"
                : "justify-evenly"
            }`}
          >
            {displayedPersons?.map((person, index) => (
              <div key={index} className="text-wrap flex flex-col">
                <div className="rounded-3xl md:rounded-[2rem] overflow-hidden w-16 h-20 md:h-40 md:w-32 relative">
                  {person.profileImageUrl ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w200${person.profileImageUrl}`}
                      alt={person.character}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover object-top"
                    />
                  ) : (
                    <div className="bg-lightGray h-full text-center flex justify-center items-center">
                      <IoPerson className="text-9xl text-gray" />
                    </div>
                  )}
                </div>
                <div className="w-20 md:w-32 text-wrap">
                  <p className="flex flex-wrap text-sm md:text-base">
                    {person.person.name}
                  </p>
                  <p className="text-gray break-words text-sm md:text-base">
                    {person.character}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div
            className={`flex md:hidden md:flex-wrap gap-2 md:gap-7 overflow-x-auto no-scrollbar`}
          >
            {person?.map((person, index) => (
              <div key={index} className="text-wrap flex flex-col">
                <div className="rounded-3xl md:rounded-[2rem] overflow-hidden w-16 h-20 md:h-40 md:w-32 relative">
                  {person.profileImageUrl ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w200${person.profileImageUrl}`}
                      alt={person.character}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover object-top"
                    />
                  ) : (
                    <div className="bg-lightGray h-full text-center flex justify-center items-center">
                      <IoPerson className="text-9xl text-gray" />
                    </div>
                  )}
                </div>
                <div className="w-20 md:w-32 text-wrap">
                  <p className="flex flex-wrap text-sm md:text-base">
                    {person.person.name}
                  </p>
                  <p className="text-gray break-words text-sm md:text-base">
                    {person.character}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* <div className="space-y-3">
          <div className="justify-between flex">
            <h3 className="text-xl text-primary font-bold">Crew</h3>
            <div className="flex text-3xl text-gray gap-3">
              <button
                className="border rounded-full border-lightGray outline-none"
                onClick={handleBackward}
              >
                <IoIosArrowBack />
              </button>
              {console.log(displayedPersons)}
              <button
                className="border rounded-full border-lightGray outline-none disabled:bg-lightGray"
                onClick={handleForward}
                disabled={displayedPersons?.length < itemsPerPage}
              >
                <IoIosArrowForward />
              </button>
            </div>
          </div>
          <div
            className={`flex flex-wrap gap-7 overflow-hidden ${
              displayedPersons?.length < itemsPerPage
                ? "justify-start"
                : "justify-evenly"
            }`}
          >
            {displayedPersons?.map((person, index) => (
              <div key={index} className="text-wrap flex flex-col">
                <div className="rounded-[2rem] overflow-hidden h-40 w-32 relative">
                  {person.profileImageUrl ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w200${person.profileImageUrl}`}
                      alt={person.character}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover object-top"
                    />
                  ) : (
                    <div className="bg-lightGray h-full text-center flex justify-center items-center">
                      <IoPerson className="text-9xl text-gray" />
                    </div>
                  )}
                </div>
                <div className="w-32 text-wrap">
                  <p className="flex flex-wrap">{person.person.name}</p>
                  <p className="text-gray break-words">{person.character}</p>
                </div>
              </div>
            ))}
          </div> 
        </div>*/}

        <div className="space-y-3 grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xl text-primary font-bold">Trailer</h3>

            <div className="rounded-3xl overflow-hidden w-full">
              {/* {console.log(movie)} */}
              {movie && (
                <iframe
                  // width=""
                  // height="500"
                  src={`https://www.youtube.com/embed/${
                    movie?.trailer?.split("?v=")[1]
                  }`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen;"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="w-full md:h-[26rem] aspect-video"
                ></iframe>
              )}
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-xl text-primary font-bold">Ratings</h3>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex relative justify-center flex-col h-32 items-center gap-3 bg-yellow-400">
                <p className="text-5xl font-semibold">7.5</p>
                <Image
                  src={IMDBLogo}
                  alt="trakt"
                  width={80}
                  height={80}
                  className=""
                />
              </div>
              <div className="flex relative justify-center flex-col h-32 items-center gap-3 bg-sky-900">
                <p className="text-5xl text-white font-semibold">7.5</p>
                <Image
                  src={TMDBLogo}
                  alt="trakt"
                  width={60}
                  height={60}
                  className=""
                />
              </div>
              <div className="flex relative justify-center flex-col h-32 items-center gap-3 bg-zinc-200">
                <p className="text-5xl font-semibold">7.5</p>
                <Image
                  src={RottenTomatoesLogo}
                  alt="trakt"
                  width={60}
                  height={60}
                  className=""
                />
              </div>
              <div className="flex relative justify-center flex-col h-32 items-center gap-3 bg-black">
                <p className="text-5xl text-white font-semibold">7.5</p>
                <Image
                  src={MetacriticLogo}
                  alt="trakt"
                  width={60}
                  height={60}
                  className=""
                />
              </div>
              <div className="flex relative justify-center flex-col h-32 items-center gap-3 bg-black">
                <p className="text-5xl text-white font-semibold">7.5</p>
                <Image
                  src={TraktLogo}
                  alt="trakt"
                  width={60}
                  height={60}
                  className=""
                />
              </div>
            </div>

            {/* <div className="space-y-5">
              <div className="flex items-center gap-3">
                <Image src={TraktLogo} alt="trakt" width={45} height={45} />
                <p className="text-lg">7.5</p>
              </div>
              <div className="flex items-center gap-3">
                <Image src={IMDBLogo} alt="trakt" width={45} height={45} />
                <p className="text-lg">7.5</p>
              </div>
              <div className="flex items-center gap-3">
                <Image src={TMDBLogo} alt="trakt" width={45} height={45} />
                <p className="text-lg">7.5</p>
              </div>
              <div className="flex items-center gap-3">
                <Image
                  src={RottenTomatoesLogo}
                  alt="trakt"
                  width={45}
                  height={45}
                />
                <p className="text-lg">7.5</p>
              </div>
              <div className="flex items-center gap-3">
                <Image
                  src={MetacriticLogo}
                  alt="trakt"
                  width={45}
                  height={45}
                />
                <p className="text-lg">7.5</p>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <BottomSheet
        bottomSheet={bottomSheet}
        setBottomSheet={setBottomSheet}
        statusFlag={statusFlag}
        setStatusFlag={setStatusFlag}
      />
    </div>
  );
}
