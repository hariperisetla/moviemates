import Hero from "@/components/dashboard/Hero";
import VerticalItemsList from "@/components/dashboard/VerticalItemsList";
import Settings from "@/components/dashboard/Settings";

export default function Movies({ searchParams }) {
  return (
    <div className="space-y-5 md:space-y-8 items-center w-full text-center">
      {/* <Settings /> */}
      <Hero type={searchParams.type} />

      <hr className="border-lightGray md:hidden" />

      {/* <VerticalItemsList listType={"watchlist"} /> */}

      <VerticalItemsList listType={"trending"} type={searchParams.type} />

      <VerticalItemsList listType={"trending"} type={searchParams.type} />
    </div>
  );
}
