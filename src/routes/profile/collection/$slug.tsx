import IconSettings from "@/assets/svgs/icon-settings.svg?react";
import NestedLayout from "@/components/common/layouts/NestedLayout";
import CollectionItemCard from "@/components/pages/collection/CollectionItemCard";
import { Button } from "@/components/ui/button";
import type { CollectionItem } from "@/types/collection";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/profile/collection/$slug")({
  component: RouteComponent,
});

const COLLECTION_ITEMS: CollectionItem[] = [
  {
    id: "1",
    title: "Captain Marvel",
    imageUrl:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=400&fit=crop",
    typeDesc: "Watch Up to episode 1",
    episodes: 12,
    rating: 5.0,
  },
  {
    id: "2",
    title: "Avengers: Endgame",
    imageUrl:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=400&fit=crop",
    typeDesc: "Watch Up to episode 5",
    episodes: 24,
    rating: 4.8,
    resolution: "4K",
  },
  {
    id: "3",
    title: "Spider-Man: No Way Home",
    imageUrl:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=400&fit=crop",
    typeDesc: "Watch Up to episode 3",
    episodes: 18,
    rating: 4.9,
  },
  {
    id: "4",
    title: "Black Panther",
    imageUrl:
      "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=800&h=400&fit=crop",
    typeDesc: "Watch Up to episode 8",
    episodes: 16,
    rating: 4.7,
    resolution: "HD",
  },
  {
    id: "5",
    title: "Iron Man",
    imageUrl:
      "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=400&fit=crop",
    typeDesc: "Watch Up to episode 2",
    episodes: 20,
    rating: 4.6,
  },
  {
    id: "6",
    title: "Thor: Ragnarok",
    imageUrl:
      "https://images.unsplash.com/photo-1512070679279-8988d32161be?w=800&h=400&fit=crop",
    typeDesc: "Watch Up to episode 6",
    episodes: 14,
    rating: 4.9,
    resolution: "4K",
  },
  {
    id: "7",
    title: "Doctor Strange",
    imageUrl:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&h=400&fit=crop",
    typeDesc: "Watch Up to episode 4",
    episodes: 22,
    rating: 4.5,
  },
  {
    id: "8",
    title: "Guardians of the Galaxy",
    imageUrl:
      "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=400&fit=crop",
    typeDesc: "Watch Up to episode 7",
    episodes: 15,
    rating: 4.8,
    resolution: "HD",
  },
  {
    id: "9",
    title: "Ant-Man",
    imageUrl:
      "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=800&h=400&fit=crop",
    typeDesc: "Watch Up to episode 1",
    episodes: 10,
    rating: 4.4,
  },
  {
    id: "10",
    title: "Captain America: Civil War",
    imageUrl:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=400&fit=crop",
    typeDesc: "Watch Up to episode 9",
    episodes: 26,
    rating: 4.7,
    resolution: "4K",
  },
];

function RouteComponent() {
  return (
    <NestedLayout
      title="Collection Item"
      isIncludeBack
      actionNode={
        <Button
          type="button"
          size={"icon"}
          variant={"ghost"}
          onClick={() => {
            console.log("action clicked");
          }}
          className="rounded-full border border-white/10"
        >
          <IconSettings className="size-6 text-white" />
        </Button>
      }
    >
      <div className="flex flex-col gap-y-4 px-4">
        {COLLECTION_ITEMS.map((item) => (
          <CollectionItemCard key={item.id} item={item} />
        ))}
      </div>
    </NestedLayout>
  );
}
