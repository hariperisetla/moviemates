"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MdBookmarkAdd, MdBookmarkAdded } from "react-icons/md";
import { setWatchlistMovies } from "@/actions/setWatchlistMovies";
import { getWatchlistMovies } from "@/actions/getWatchlistMovies";
import { getTrendingMovies } from "@/actions/getTrendingMovies";

import { useRouter, useSearchParams } from "next/navigation";
import { IoMdAdd } from "react-icons/io";

export default function Hero({ type = "movies" }) {
  const [items, setItems] = useState([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  const params = useSearchParams();

  let interval = 5000;

  const [currentIndex, setCurrentIndex] = useState(0);
  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? items?.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === items?.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const router = useRouter();

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, interval);
    return () => clearInterval(slideInterval);
  }, [currentIndex, interval]);

  // Function to fetch movies
  async function fetchItems() {
    try {
      let itemsData;

      ("use server");
      async function getItemData() {
        let itemsData = await getWatchlistMovies(5, type);

        if (itemsData.length === 0) {
          itemsData = await getTrendingMovies(undefined, 5, type);
        } else {
          // Mark movies in watchlist with isInWatchlist = true
          itemsData = itemsData.map((item) => ({
            ...item,
            isInWatchlist: true,
          }));
        }

        return itemsData;
      }

      itemsData = await getItemData();

      console.log(itemsData);

      setItems(itemsData);

      const interval = setInterval(() => {
        setCurrentItemIndex((prevIndex) =>
          prevIndex === itemsData.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  }

  // Fetch movies on component mount
  useEffect(() => {
    fetchItems();
  }, [params]);

  if (items.length === 0) {
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

  async function handleUpdateWatchlist(item) {
    try {
      const updatedItems = items.map((m) =>
        m.item.ids.trakt === item.item.ids.trakt
          ? { ...m, isInWatchlist: !m.isInWatchlist }
          : m
      );

      if (item.isInWatchlist) {
        // Remove from watchlist
        await setWatchlistMovies(item.item.ids.trakt);
        // Check if movies will be empty after removal
        if (updatedItems.length === 1) {
          const newItemsData = await getTrendingMovies(undefined, 3);
          setItems(newItemsData);
        } else {
          setItems(updatedItems);
        }
      } else {
        // Add to watchlist
        await setWatchlistMovies(item.item.ids.trakt);
        setItems(updatedItems);
      }

      router.refresh();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="relative h-[17rem] md:h-[35rem] w-full md:rounded-[3rem] overflow-hidden">
      {items &&
        items.map((item, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 space-y-2 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="relative h-[13rem] rounded-3xl overflow-hidden md:h-full w-full">
              <Link href={`/movies/${item.item?.ids?.slug}`} key={index}>
                <div className="bg-gradient-to-t from-black from-10% to-transparent h-[13rem] md:h-[35rem] w-full absolute z-10 opacity-50"></div>
                <Image
                  src={`https://image.tmdb.org/t/p/w1280${
                    item.landscapeImageUrl
                      ? item.landscapeImageUrl
                      : item.portraitImageUrl
                  }`}
                  alt={item?.item?.title + " image"}
                  fill
                  className={`object-cover ${
                    item.landscapeImageUrl ? "object-top" : "object-center"
                  }`}
                />
              </Link>
              <div className="flex items-end w-full md:w-auto h-full pb-3 md:pb-8">
                <div className="md:text-left px-3 w-full md:px-8 space-y-2 md:space-y-3 text-white z-20 text-center">
                  <Link
                    href={`/movies/${item?.item?.ids.slug}`}
                    className="space-y-2 md:space-y-3"
                  >
                    <div className="space-x-1 md:space-x-3 hidden md:flex justify-center md:justify-start items-center md:items-start">
                      {item.item?.genres.map((genre, index) => (
                        <p
                          key={index}
                          className="capitalize text-sm md:text-base flex items-center bg-white/30 shadow  rounded-[3rem] px-4 py-1"
                        >
                          {genre}
                        </p>
                      ))}
                    </div>
                    <h2 className="md:pb-2 text-2xl text-left flex-wrap md:text-5xl font-bold">
                      {item.item?.title}
                    </h2>
                    <div className="space-x-1 md:space-x-3 flex justify-start md:justify-start items-start md:items-start">
                      {item.item?.genres.map((genre, index) => (
                        <p
                          key={index}
                          className="capitalize text-sm md:text-base flex items-center shadow  rounded-[3rem] px-1"
                        >
                          {genre}
                          {index !== item.item.genres.length - 1 && ","}
                        </p>
                      ))}
                    </div>
                    <div className="hidden md:flex justify-start gap-2 md:gap-5 text-sm md:text-lg">
                      <p>{item.item?.year}</p>
                      <p>|</p>
                      <p>{getRuntime(item.item?.runtime)}</p>
                      <p>|</p>
                      
                      <p>
                        {item.item?.certification
                          ? item.item.certification
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

                    <button className="text-3xl md:hidden text-primary bg-secondary rounded-3xl p-2">
                      <IoMdAdd />
                    </button>
                    <button
                      onClick={() => handleUpdateWatchlist(item)}
                      className={`${
                        item.isInWatchlist ? "bg-primary/30" : "bg-secondary/30"
                      } hidden md:flex text-3xl md:text-4xl border-2 border-secondary/30 rounded-3xl md:px-4 md:py-2`}
                    >
                      {item.isInWatchlist ? (
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
                <IoMdAdd />
              </button>
              <button
                onClick={() => handleUpdateWatchlist(item)}
                className={`${
                  item.isInWatchlist ? "bg-primary/30" : "bg-secondary/30"
                } hidden md:flex text-3xl md:text-4xl border-2 border-secondary/30 rounded-3xl md:px-4 md:py-2`}
              >
                {item.isInWatchlist ? <MdBookmarkAdded /> : <MdBookmarkAdd />}
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}
