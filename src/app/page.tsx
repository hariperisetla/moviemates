import Image from "next/image";
import Link from "next/link";
import { MdMovieCreation } from "react-icons/md";
import { BiMenuAltLeft } from "react-icons/bi";
import Logo from "@/assets/logo.svg";

export default function Home() {
  return (
    <div>
      <div className="flex w-full justify-between p-3 items-center absolute">
        <Link
          href={"/"}
          className=" gap-2 font-bold text-primary text-2xl md:text-3xl flex items-center"
        >
          <div className="relative">
            <Image src={Logo} alt="logo" width="50" height="50" />
          </div>
          <p className="text-primary pt-2">
            Movie<span className="text-gray">Mates</span>
          </p>
        </Link>

        <div className="flex md:hidden">
          <BiMenuAltLeft className="text-4xl" />
        </div>

        <ul className="hidden md:flex gap-5 items-center font-bold text-gray">
          <li className="text-primary">Home</li>
          <li>About</li>
          <li>Contact Us</li>
          <Link href={"/login"} className="">
            Login
          </Link>
          <Link
            href="/login"
            className="bg-primary text-white px-5 py-2 rounded-xl"
          >
            Get Started
          </Link>
        </ul>
      </div>

      <main className="h-screen pt-16">
        {/* bg-gradient-to-br from-secondary from-30% via-[#d5def3] via-50% to-secondary to-90% */}
        <section className="container grid grid-cols-1 md:grid-cols-3 md:space-y-5 max-w-7xl h-full justify-center items-center mx-auto px-5">
          <div className="md:col-span-2 space-y-5">
            <h2 className="font-bold text-primary text-3xl md:text-7xl">
              Never run out of things to watch together.
            </h2>
            <p className="text-lg md:text-2xl text-gray font-medium">
              Create shareable lists of movies and TV shows from all over the
              world to watch with your mates.
            </p>

            <div className="text-lg md:text-xl space-x-5">
              <Link
                href={"/login"}
                className="bg-primary text-white px-5 py-2 rounded-xl"
              >
                Get Started
              </Link>
              <button className="border-b-2 border-black">Know More</button>
            </div>
          </div>

          <div className="justify-center md:justify-end flex">
            <Image
              src={"/img/iPhone-mockup.svg"}
              alt="iphone mockup"
              width={300}
              height={100}
              className="object-cover object-center hidden md:flex"
            />

            <Image
              src={"/img/iPhone-mockup.svg"}
              alt="iphone mockup"
              width={200}
              height={100}
              className="object-cover object-center flex md:hidden"
            />
          </div>
        </section>
      </main>

      <section className="container max-w-5xl text-center mx-auto space-y-8 pb-40">
        <h2 className="text-3xl font-semibold text-primary">
          Your watching experience now made simple
        </h2>

        <div className="grid md:grid-cols-3 gap-5 px-5">
          <div className="space-y-5 text-left">
            <div className="bg-secondary h-64 w-full rounded-xl"></div>
            <div>
              <h3 className="text-2xl font-semibold">Custom Lists</h3>
              <p>Movies to watch exclusively for you.</p>
            </div>
          </div>
          <div className="space-y-5 text-left">
            <div className="bg-secondary h-64 w-full rounded-xl"></div>
            <div>
              <h3 className="text-2xl font-semibold">Feature 2</h3>
              <p>Movies to watch exclusively for you.</p>
            </div>
          </div>
          <div className="space-y-5 text-left">
            <div className="bg-secondary h-64 w-full rounded-xl"></div>
            <div>
              <h3 className="text-2xl font-semibold">Feature 3</h3>
              <p>Movies to watch exclusively for you.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary">
        <div className="container max-w-5xl mx-auto px-5 md:px-20">
          <div className="grid md:grid-cols-3 gap-52 py-20">
            <div className="relative">
              <div className="bg-secondary w-72 h-72 rounded-lg absolute -top-28 md:-top-36"></div>
            </div>
            <div className="text-white md:col-span-2">
              <h2 className="text-3xl font-semibold">Convincing Feature 1</h2>
              <p>
                Subtitle convincing the user to make use of this exclusive
                feature.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-52 py-20 md:pt-52">
            <div className="relative flex md:hidden">
              <div className="bg-secondary w-72 h-72 rounded-lg absolute -top-28 -right-0"></div>
            </div>
            <div className="text-white md:col-span-2 text-right md:text-left">
              <h2 className="text-3xl font-semibold">Convincing Feature 1</h2>
              <p>
                Subtitle convincing the user to make use of this exclusive
                feature.
              </p>
            </div>
            <div className="relative hidden md:flex">
              <div className="bg-secondary w-72 h-72 rounded-lg absolute -top-16"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="container flex py-52 mx-auto items-center justify-center max-w-5xl">
        <div>
          <button className="bg-primary text-2xl text-white px-5 py-2 rounded-xl">
            Get Started Now
          </button>
        </div>
      </section>

      <footer className="bg-secondary py-20">
        <div className="container max-w-5xl grid md:grid-cols-5 mx-auto items-center justify-center text-center gap-10">
          <div className="md:col-span-2 text-center md:text-left">
            <Link
              href={"/"}
              className=" gap-2 font-bold font-libreBaskerville text-2xl md:text-3xl flex items-center"
            >
              <MdMovieCreation className="text-3xl md:text-4xl" />
              <span>MovieMates</span>
            </Link>
            Your Watchlist partner.
          </div>

          <div className="space-y-5">
            <h4 className="text-2xl font-semibold text-white">Quick Links</h4>
            <div className="flex flex-col space-y-1">
              <Link href={"/"}>Home</Link>
              <Link href={"/"}>About</Link>
              <Link href={"/"}>Contact Us</Link>
            </div>
          </div>
          <div className="space-y-5">
            <h4 className="text-2xl font-semibold text-white">Legal</h4>
            <div className="flex flex-col space-y-1">
              <Link href={"/"}>Privacy Policy</Link>
              <Link href={"/"}>Terms of Use</Link>
            </div>
          </div>
          <div className="space-y-5">
            <h4 className="text-2xl font-semibold text-white">Social Links</h4>
            <div className="flex flex-col space-y-1">
              <Link href={"/"}>Facebook</Link>
              <Link href={"/"}>Instagram</Link>
              <Link href={"/"}>Twitter (X)</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
