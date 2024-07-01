import Link from "next/link";
import {
  IoAdd,
  IoAddCircle,
  IoAddCircleOutline,
  IoBookmarkOutline,
  IoHome,
  IoHomeOutline,
  IoList,
  IoListOutline,
  IoPerson,
  IoPersonOutline,
  IoSearch,
  IoSearchOutline,
} from "react-icons/io5";

import { usePathname } from "next/navigation";

export default function BottomTabs() {
  const path = usePathname();

  return (
    <div className="text-gray z-20 bg-white fixed bottom-0 text-center w-full py-2">
      <div>
        <ul
          className={`grid grid-cols-5 w-full text-2xl justify-between items-center bg-white duration-300 ease-in-out transition-all`}
        >
          <li>
            <Link
              href={"/home"}
              className={`${
                path.includes("home")
                  ? "text-primary font-bold"
                  : "font-semibold"
              } items-center flex flex-col space-y-1 duration-300 ease-in-out transition-all`}
            >
              {path.includes("home") ? <IoHome /> : <IoHomeOutline />}
              <span className="text-xs">Home</span>
            </Link>
          </li>
          <li>
            <Link
              href={"/search"}
              className={`${
                path.includes("search")
                  ? "text-primary font-bold"
                  : "font-semibold"
              } items-center flex flex-col space-y-1 duration-300 ease-in-out transition-all`}
            >
              {path.includes("search") ? <IoSearch /> : <IoSearchOutline />}
              <span className="text-xs font-semibold">Search</span>
            </Link>
          </li>
          <li className="relative">
            <Link
              href={"/create-list"}
              className="items-center text-6xl flex flex-col absolute left-0 right-0 -top-12 duration-300 ease-in-out transition-all"
            >
              <IoAddCircle className="text-primary bg-white rounded-full" />
            </Link>
          </li>
          <li>
            <Link
              href={"/watchlist"}
              className={`${
                path.includes("watchlist")
                  ? "text-primary font-bold"
                  : "font-semibold"
              } items-center flex flex-col space-y-1  duration-300 ease-in-out transition-all`}
            >
              {path.includes("watchlist") ? <IoList /> : <IoListOutline />}
              <span className="text-xs font-semibold">Lists</span>
            </Link>
          </li>
          <li>
            <Link
              href={"/profile"}
              className={`${
                path.includes("profile")
                  ? "text-primary font-bold"
                  : "font-semibold"
              } items-center flex flex-col space-y-1 duration-300 ease-in-out transition-all`}
            >
              {path.includes("profile") ? <IoPerson /> : <IoPersonOutline />}
              <span className="text-xs">Profile</span>
            </Link>
          </li>
          {/* <li>
          <Link href={"/menu"} className="items-center flex flex-col">
            <BiMenu />
            <span className="text-sm">Menu</span>
          </Link>
        </li> */}
        </ul>

        {/* <div
          className={`${path.includes("/movies/") ? "flex" : "hidden"} px-5`}
        >
          <button className="capitalize text-secondary font-semibold bg-primary w-full py-3 rounded-2xl">
            Tell a mate
          </button>
        </div> */}
      </div>
    </div>
  );
}
