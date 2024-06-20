import Hero from "@/components/dashboard/Hero";
import VerticalItemsList from "@/components/dashboard/VerticalItemsList";

export default function Movies() {
  return (
    <div className="space-y-8 items-center w-full text-center">
      <Hero />

      <div className="text-left space-y-3">
        <h2 className="text-2xl font-semibold">
          Next on <span className="text-primary">next watch</span> list
        </h2>
        <VerticalItemsList type={"watchlist"} />
      </div>

      <div className="text-left space-y-3">
        <h2 className="text-2xl font-semibold">
          Next on <span className="text-primary">next watch</span> list
        </h2>
        <VerticalItemsList type={"trending"} />
      </div>

      <div className="text-left space-y-3">
        <h2 className="text-2xl font-semibold">
          Trending <span className="text-primary">now</span>
        </h2>
        <VerticalItemsList type={"trending"} />
      </div>
    </div>
  );
}
