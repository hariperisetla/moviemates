import Hero from "@/components/dashboard/Hero";
import VerticalItemsList from "@/components/dashboard/VerticalItemsList";
import Settings from "@/components/dashboard/Settings";

export default function Movies() {
  return (
    <div className="space-y-5 md:space-y-8 items-center w-full text-center">
      {/* <Settings /> */}
      <Hero />

      <hr className="border-lightGray" />

      <VerticalItemsList type={"watchlist"} />

      <VerticalItemsList type={"trending"} />

      <VerticalItemsList type={"trending"} />
    </div>
  );
}
