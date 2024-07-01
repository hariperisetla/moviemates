import Image from "next/image";
import Link from "next/link";

export default function List({ items }) {
  return (
    <div>
      {/* <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 transition-all ease-in-out opacity-0 hover:opacity-100 hover:backdrop-brightness-105 hover:backdrop-blur-sm h-full text-white text-xl px-3 z-10"
      >
        &lt;
      </button> */}
      <ul
        // ref={listRef}
        className="flex justify-start items-start space-x-3 overflow-x-auto md:overflow-x-hidden h-full no-scrollbar"
      >
        {items &&
          items.map((itemData, index) => (
            <li key={index} className="flex flex-col space-y-3 w-32 md:w-48">
              <Link
                href={`/${itemData.type}/${itemData.item?.ids.slug}`}
                key={index}
                className="relative w-32 h-52 md:w-48 md:h-72 rounded-3xl overflow-hidden"
              >
                <Image
                  src={`https://image.tmdb.org/t/p/w500${itemData.portraitImageUrl}`}
                  alt={itemData.item?.title}
                  fill
                  className="object-cover object-center"
                />
              </Link>
              <div className="w-full rounded-b-xl overflow-hidden">
                <p className="text-black text-sm items-center flex flex-wrap">
                  {itemData.item?.title.length > 27
                    ? `${itemData.item.title.substring(0, 27)}...`
                    : itemData.item?.title}{" "}
                  {/* {movieData.movie.title} */}
                </p>
                <span className="text-gray text-sm items-center">
                  {itemData.item?.year}
                </span>
              </div>
            </li>
          ))}
      </ul>
      {/* <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 z-10"
      >
        &gt;
      </button> */}
    </div>
  );
}
