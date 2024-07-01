import Image from "next/image";
import Logo from "@/assets/logo.svg";

export default function Loading() {
  return (
    <div>
      <div className="bg-white inset-0 w-full h-screen justify-center items-center flex">
        <div className="relative">
          <Image
            src={Logo}
            alt="logo"
            width="100"
            height="100"
            className="animate-pulse"
          />
        </div>
      </div>
    </div>
  );
}
