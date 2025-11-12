import { MovieCard } from "./MovieCard";
import { mockTopTenWatchlist } from "@/data/mockMovies";

export function MoreMovie() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {mockTopTenWatchlist.map((item) => (
        <MovieCard key={item.id} item={item} />
      ))}
    </div>
  );
}