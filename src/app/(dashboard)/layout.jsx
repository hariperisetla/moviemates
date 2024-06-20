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
    // { name: "Fantasy", slug: "fantasy" },
    // { name: "History", slug: "history" },
    // { name: "Holiday", slug: "holiday" },
    // { name: "Horror", slug: "horror" },
    // { name: "Music", slug: "music" },
    // // { name: "Musical", slug: "musical" },
    // // { name: "Mystery", slug: "mystery" },
    // // { name: "None", slug: "none" },
    // // { name: "Romance", slug: "romance" },
    // // { name: "Science Fiction", slug: "science-fiction" },
    // // { name: "Short", slug: "short" },
    // // { name: "Sporting Event", slug: "sporting-event" },
    // // { name: "Superhero", slug: "superhero" },
    // // { name: "Suspense", slug: "suspense" },
    // // { name: "Thriller", slug: "thriller" },
    // // { name: "War", slug: "war" },
    // // { name: "Western", slug: "western" },
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
    <div className="bg-radial-bg bg-cover bg-repeat backdrop-blur-3xl relative min-h-screen max-h-screen overflow-hidden">
      <div className="flex">
        <div className="px-5 py-5 hidden md:flex">
          <div className="fixed rounded-3xl w-72 shadow bg-white space-y-8 h-[95vh] p-5 overflow-y-auto">
            <Link
              href={"/"}
              className="gap-2 p-3 font-bold font-libreBaskerville text-primary text-2xl md:text-2xl flex items-center"
            >
              <MdMovieCreation className="text-3xl md:text-3xl" />
              <span>MovieMates</span>
            </Link>

            <div className="space-y-3 px-3">
              <h4 className="text-base uppercase font-bold text-primary">
                Your Lists
              </h4>
              <div className="flex flex-col space-y-3 text-lg text-gray-500">
                <Link href={"/watchlist"} className="flex gap-1 items-center">
                  <BiNotepad />
                  Next Watch
                </Link>
                <Link href={"/"} className="flex gap-1 items-center">
                  <MdFavorite />
                  Y2K RomComs
                </Link>
                <Link href={"/"} className="flex gap-1 items-center">
                  <BiNotepad /> Next Watch
                </Link>
              </div>
            </div>

            <div className="space-y-3 px-3">
              <h4 className="text-base uppercase font-bold text-primary">
                Genres
              </h4>
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

                {/* <Link href={"/"} className="flex gap-1 items-center">
                  <BiNotepad />
                  Action
                </Link>
                <Link href={"/"} className="flex gap-1 items-center">
                  <MdFavorite />
                  Adventure
                </Link>
                <Link href={"/"} className="flex gap-1 items-center">
                  <BiNotepad /> Animation
                </Link>
                <Link href={"/"} className="flex gap-1 items-center">
                  <BiNotepad /> Comedy
                </Link>
                <Link href={"/"} className="flex gap-1 items-center">
                  <BiNotepad /> Crime
                </Link>
                <Link href={"/"} className="flex gap-1 items-center">
                  <BiNotepad /> Documentary
                </Link>
                <Link href={"/"} className="flex gap-1 items-center">
                  <BiNotepad /> Drama
                </Link>
                <Link href={"/"} className="flex gap-1 items-center">
                  <BiNotepad /> Family
                </Link>
                <Link href={"/"} className="flex gap-1 items-center">
                  <BiNotepad /> Fantasy
                </Link>
                <Link href={"/"} className="flex gap-1 items-center">
                  <BiNotepad /> History
                </Link>
                <Link href={"/"} className="flex gap-1 items-center">
                  <BiNotepad /> Horror
                </Link> */}
              </div>
            </div>
          </div>
        </div>

        <div className="md:ml-72 pt-5 pb-28 md:pb-0 px-5 md:px-10 space-y-5 flex-grow overflow-y-auto min-h-screen max-h-screen">
          <div className="w-full bg-transparent">
            <div className="flex justify-between w-full">
              <div className="relative shadow rounded-3xl">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies and more"
                  className={`py-3 px-5 text-sm ${
                    searchResults?.length > 0
                      ? "rounded-t-3xl"
                      : "rounded-l-3xl"
                  }  outline-none mr-5 bg-white backdrop-blur-3xl placeholder:text-gray-500`}
                />
                <div
                  className={`absolute text-gray-500 bg-white pl-2 pr-5 py-3 ${
                    searchResults?.length > 0
                      ? "rounded-tr-3xl"
                      : "rounded-r-3xl"
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
          </div>
          {children}
        </div>
      </div>
      <div className="flex md:hidden">
        <BottomTabs />
      </div>
    </div>
  );
}
