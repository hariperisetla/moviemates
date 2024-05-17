import Link from "next/link";
import { MdMovieCreation } from "react-icons/md";

export default function Home() {
  return (
    <div className="p-3  bg-indigo-600 bg-gradient-to-br from-indigo-600 via-50% to-indigo-800 to-90% ">
      <div className="flex justify-between">
        <Link
          href={"/"}
          className="text-white gap-2 font-bold uppercase text-2xl md:text-3xl flex items-center"
        >
          <MdMovieCreation className="text-3xl md:text-4xl" />
          <span>MovieMates</span>
        </Link>

        <ul className="text-indigo-50 hidden md:flex gap-5 items-center">
          <li>About</li>
          <li>Blog</li>
          <li>Contact</li>
          <Link href={"/home"} className="border px-5 py-2 rounded-xl">
            Sign In
          </Link>
          <button className="bg-indigo-50 border border-indigo-50 text-indigo-600 px-5 py-2 rounded-xl">
            Sign Up
          </button>
        </ul>
      </div>

      <main className="h-[93.2vh] md:h-[92.8vh]">
        {/* bg-gradient-to-br from-secondary from-30% via-[#d5def3] via-50% to-secondary to-90% */}
        <section className="container space-y-5 text-indigo-50 max-w-7xl text-center h-full flex flex-col justify-center items-center mx-auto">
          <h2 className="font-playfair font-semibold text-2xl md:text-5xl leading-snug md:leading-snug">
            Welcome to MovieMates, your ultimate companion for discovering and
            sharing movies and series!
          </h2>

          <div className="text-lg md:text-xl space-x-5">
            <Link
              href={"/home"}
              className="bg-indigo-50 border border-indigo-50 text-indigo-600 px-5 py-2 rounded-xl"
            >
              Get Started
            </Link>
            <button className="border px-5 py-2 rounded-xl">Learn More</button>
          </div>
        </section>
      </main>
    </div>
  );
}
