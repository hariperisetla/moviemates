import {
  BiSolidHome,
  BiSolidSearch,
  BiListCheck,
  BiSolidUserCircle,
  BiMenu,
} from "react-icons/bi";
import Link from "next/link";
import {
  IoAdd,
  IoAddCircle,
  IoAddCircleOutline,
  IoBookmarkOutline,
  IoHome,
  IoHomeOutline,
  IoListOutline,
  IoPersonOutline,
  IoSearch,
  IoSearchOutline,
} from "react-icons/io5";

export default function BottomTabs() {
  return (
    <div className="text-gray z-20 bg-white fixed bottom-0 text-center w-full py-2">
      <Link
        href={"/search"}
        className="items-center -top-4 text-6xl absolute left-0 right-0 flex flex-col pb-5"
      >
        <IoAddCircle className="text-primary bg-white rounded-full" />
      </Link>
      <ul className="grid grid-cols-5 w-full text-2xl justify-between items-center bg-white">
        <li>
          <Link
            href={"/home"}
            className="items-center flex flex-col text-primary"
          >
            <IoHome />

            <span className="text-sm font-semibold">Home</span>
          </Link>
        </li>
        <li>
          <Link href={"/search"} className="items-center flex flex-col">
            <IoSearchOutline />
            <span className="text-sm font-semibold">Search</span>
          </Link>
        </li>
        <li></li>
        <li>
          <Link
            href={"/watchlist"}
            className="items-center font-semibold flex flex-col"
          >
            <IoListOutline />
            <span className="text-sm font-semibold">Lists</span>
          </Link>
        </li>
        <li>
          <Link
            href={"/profile"}
            className="items-center flex font-semibold flex-col"
          >
            <IoPersonOutline />
            <span className="text-sm">Profile</span>
          </Link>
        </li>
        {/* <li>
          <Link href={"/menu"} className="items-center flex flex-col">
            <BiMenu />
            <span className="text-sm">Menu</span>
          </Link>
        </li> */}
      </ul>
    </div>
  );
}
