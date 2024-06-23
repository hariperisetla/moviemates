"use client";

import BottomTabs from "@/components/BottomTabs";
import Link from "next/link";
import { MdMovieCreation } from "react-icons/md";
import { BiNotepad } from "react-icons/bi";
import { MdFavorite } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { IoMdContact } from "react-icons/io";
import { IoMdSettings } from "react-icons/io";

import { getSearchMovies } from "@/actions/getSearchMovies";
import { useEffect, useState } from "react";
import Image from "next/image";

import Logo from "@/assets/logo.svg";
import { IoAddCircle, IoSearch } from "react-icons/io5";

// Custom hook for debouncing
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// async function getData() {
//   try {
//     const response = await fetch(`https://api.trakt.tv/genres/movies`, {
//       headers: {
//         "Content-Type": "applicateion/json",
//         "trakt-api-version": 2,
//         "trakt-api-key": process.env.CLIENT_ID,
//       },
//     });

//     const genres = await response.json();

//     return genres;
//   } catch (error) {
//     console.log("Error fetching watchlist: " + error);
//     return null;
//   }
// }

export default function DashboardLayout({ children }) {
  // const genres = await getData();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const debouncedSearchQuery = useDebounce(searchQuery, 500); // Adjust the delay as needed

  const genres = [
    { name: "Action", slug: "action" },
    { name: "Adventure", slug: "adventure" },
    { name: "Animation", slug: "animation" },
    { name: "Anime", slug: "anime" },
    { name: "Comedy", slug: "comedy" },
    { name: "Crime", slug: "crime" },
    { name: "Documentary", slug: "documentary" },
    { name: "Donghua", slug: "donghua" },
    { name: "Drama", slug: "drama" },
    { name: "Family", slug: "family" },
    { name: "Fantasy", slug: "fantasy" },
    { name: "History", slug: "history" },
    { name: "Holiday", slug: "holiday" },
    { name: "Horror", slug: "horror" },
    { name: "Music", slug: "music" },
    { name: "Musical", slug: "musical" },
    { name: "Mystery", slug: "mystery" },
    { name: "None", slug: "none" },
    { name: "Romance", slug: "romance" },
    { name: "Science Fiction", slug: "science-fiction" },
    { name: "Short", slug: "short" },
    { name: "Sporting Event", slug: "sporting-event" },
    { name: "Superhero", slug: "superhero" },
    { name: "Suspense", slug: "suspense" },
    { name: "Thriller", slug: "thriller" },
    { name: "War", slug: "war" },
    { name: "Western", slug: "western" },
  ];

  useEffect(() => {
    async function handleSearch() {
      if (debouncedSearchQuery) {
        const results = await getSearchMovies(debouncedSearchQuery);
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    }

    handleSearch();
  }, [debouncedSearchQuery]);

  return (
    <div className="md:flex">
      <div className="fixed hidden md:flex md:flex-col w-80 border-r border-r-lightGray/75 space-y-8 h-full p-12 overflow-y-auto">
        {/* Logo */}
        <Link
          href={"/"}
          className="pb-2 gap-2 font-bold text-primary text-2xl md:text-2xl flex items-center"
        >
          <div className="relative">
            <Image src={Logo} alt="logo" width="45" height="45" />
          </div>
          <p className="text-primary pt-2">
            Movie<span className="text-gray">Mates</span>
          </p>
        </Link>

        <div className="space-y-16">
          <div className="space-y-5">
            <span className="text-base uppercase font-bold text-lightGray">
              MENU
            </span>
            <div className="flex flex-col space-y-5 text-lg font-semibold text-gray">
              <Link
                href={"/home"}
                className="flex gap-1 items-center text-primary"
              >
                {/* <BiNotepad /> */}
                Home
              </Link>
              <Link href={"/watchlist"} className="flex gap-1 items-center">
                {/* <MdFavorite /> */}
                Watchlist
              </Link>
              <Link href={"/"} className="flex gap-1 items-center">
                {/* <MdFavorite /> */}
                Lists
              </Link>
              <Link href={"/"} className="flex gap-1 items-center">
                {/* <BiNotepad />  */}
                Community
              </Link>
            </div>
          </div>

          <div className="space-y-5">
            <span className="text-base uppercase font-bold text-lightGray">
              SOCIAL
            </span>
            <div className="flex flex-col space-y-5 text-lg font-semibold text-gray">
              <Link href={"/watchlist"} className="flex gap-1 items-center">
                {/* <BiNotepad /> */}
                Friends
              </Link>
              <Link href={"/"} className="flex gap-1 items-center">
                {/* <MdFavorite /> */}
                Parties
              </Link>
              <Link href={"/"} className="flex gap-1 items-center">
                {/* <BiNotepad />  */}
                Community
              </Link>
            </div>
          </div>

          <div className="space-y-5">
            <span className="text-base uppercase font-bold text-lightGray">
              GENERAL
            </span>
            <div className="flex flex-col space-y-5 text-lg font-semibold text-gray">
              <Link href={"/watchlist"} className="flex gap-1 items-center">
                {/* <BiNotepad /> */}
                Settings
              </Link>
              <Link href={"/"} className="flex gap-1 items-center">
                {/* <MdFavorite /> */}
                Help
              </Link>
            </div>
          </div>

          <div className="text-lg font-semibold text-red-500">Logout</div>
        </div>

        {/* <div className="space-y-3 px-3">
          <h4 className="text-base uppercase font-bold text-primary">Genres</h4>
          <div className="flex flex-col space-y-3 text-lg text-gray-500">
            {genres.map((genre, index) => (
              <Link
                key={index}
                href={"/" + genre.slug}
                className="flex gap-1 items-center"
              >
                <BiNotepad />
                {genre.name}
              </Link>
            ))}
          </div>
        </div> */}
      </div>
      <div className="md:ml-80 md:mr-80 pt-5 pb-28 md:pb-0 px-5 md:px-16 space-y-5 flex-grow overflow-y-auto md:min-h-screen md:max-h-screen">
        {/* <div className="w-full bg-transparent">
          <div className="flex justify-between w-full">
            <div className="relative shadow rounded-3xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies and more"
                className={`py-3 px-5 text-sm ${
                  searchResults?.length > 0 ? "rounded-t-3xl" : "rounded-l-3xl"
                }  outline-none mr-5 bg-white backdrop-blur-3xl placeholder:text-gray-500`}
              />
              <div
                className={`absolute text-gray-500 bg-white pl-2 pr-5 py-3 ${
                  searchResults?.length > 0 ? "rounded-tr-3xl" : "rounded-r-3xl"
                } top-0 bottom-0 right-0 text-base`}
              >
                <FaSearch />
              </div>

              <div className="bg-white absolute z-10 w-full">
                {searchResults &&
                  searchResults.slice(0, 5).map((result, index) => (
                    <div key={index} className=" py-2 px-5">
                      {console.log("Result: " + result.movie.ids.slug)}
                      <Link
                        href={`/movies/${result.movie.ids.slug}`}
                        className="flex gap-3"
                      >
                        <div className="relative h-20 w-12">
                          <Image
                            src={`https://image.tmdb.org/t/p/w1280${result.imageUrl}`}
                            alt={result.movie.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        {result.movie.title}
                      </Link>
                    </div>
                  ))}
              </div>
            </div>
            <div className="flex text-4xl gap-3 items-center text-primary">
              <Link href={"/"} className="">
                <IoMdContact />
              </Link>
              <Link href={"/"}>
                <IoMdSettings />
              </Link>
            </div>
          </div>
        </div> */}

        <div className="flex items-center pt-10 justify-between">
          <div className="space-x-5 font-semibold text-lg">
            <Link href={"/"} className="text-primary">
              Movies
            </Link>

            <Link href={"/"} className="text-gray">
              Shows
            </Link>
          </div>

          <div className="relative justify-end flex">
            <IoSearch
              size={25}
              className="text-gray absolute left-5 top-1 w-2/3"
            />
            <input
              type="text"
              className="border w-2/3 placeholder:text-gray outline-none  border-lightGray rounded-3xl py-1 pl-10 pr-3"
              placeholder="Search"
            />
          </div>
        </div>

        {children}
      </div>

      <div className="fixed right-0 hidden md:flex flex-col w-80 border-l border-l-lightGray/75 space-y-8 h-full p-12 overflow-y-auto">
        <div className="pt-4 space-y-8">
          <div className="space-y-3 text-gray font-semibold">
            <span className="text-gray font-bold text-lg">Genres</span>

            <div className="flex flex-wrap gap-2">
              {genres.slice(0, 5).map((genre, index) => (
                <button
                  key={index}
                  className="border border-primary bg-primary text-white rounded-[3rem] px-3 py-1"
                >
                  {genre.name}
                </button>
              ))}
            </div>
            <p className="font-medium">+ Add your favorite genres</p>
            <div className="flex flex-wrap gap-2">
              {genres.slice(6).map((genre, index) => (
                <button
                  key={index}
                  className="border border-lightGray rounded-[3rem] px-3 py-1"
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex md:hidden relative">
        <BottomTabs />
      </div>
    </div>
  );
}
