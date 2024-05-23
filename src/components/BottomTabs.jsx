import {
  BiSolidHome,
  BiSolidSearch,
  BiListCheck,
  BiSolidUserCircle,
  BiMenu,
} from "react-icons/bi";
import Link from "next/link";

export default function BottomTabs() {
  return (
    <div className="text-gray-400 z-20 bg-white bg-opacity-75 backdrop-blur-3xl backdrop-filter fixed bottom-0 text-center w-full border-t pt-3 pb-3">
      <ul className="flex w-full text-3xl justify-between px-5 items-end">
        <li>
          <Link
            href={"/home"}
            className="items-center flex flex-col text-primary"
          >
            <BiSolidHome />
            <span className="text-sm">Home</span>
          </Link>
        </li>
        <li>
          <Link href={"/search"} className="items-center flex flex-col">
            <BiSolidSearch />
            <span className="text-sm">Search</span>
          </Link>
        </li>
        <li>
          <Link href={"/watchlist"} className="items-center flex flex-col">
            <BiListCheck className="text-4xl" />
            <span className="text-sm">Lists</span>
          </Link>
        </li>
        <li>
          <Link href={"/profile"} className="items-center flex flex-col">
            <BiSolidUserCircle />
            <span className="text-sm">Profile</span>
          </Link>
        </li>
        <li>
          <Link href={"/menu"} className="items-center flex flex-col">
            <BiMenu />
            <span className="text-sm">Menu</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
