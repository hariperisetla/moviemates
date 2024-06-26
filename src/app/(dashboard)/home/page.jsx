import Hero from "@/components/dashboard/Hero";
import VerticalItemsList from "@/components/dashboard/VerticalItemsList";

export default function Movies() {
  return (
    <div className="space-y-8 items-center w-full text-center">
      <Hero />

      <VerticalItemsList type={"watchlist"} />

      <VerticalItemsList type={"trending"} />

      <VerticalItemsList type={"trending"} />
    </div>
  );
}
