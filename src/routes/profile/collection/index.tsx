import IconPlus from "@/assets/svgs/icon-plus.svg?react";
import NestedLayout from "@/components/common/layouts/NestedLayout";
import CollectionCard from "@/components/pages/collection/CollectionCard";
import { Button } from "@/components/ui/button";
import type { Collection } from "@/types/collection";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/profile/collection/")({
  component: RouteComponent,
});

const COLLECTIONS: (Collection & { isDefault?: boolean })[] = [
  {
    id: "1",
    isDefault: true,
    title: "Collection 1",
    videoCount: 4,
    isPublic: true,
    views: "99+",
  },
  {
    id: "2",
    title: "Collection 2",
    imageUrl:
      "https://images.unsplash.com/photo-1761839258575-038fef381ee7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNXx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=60&w=700",
    videoCount: 10,
    isPublic: true,
    views: "100",
  },
  {
    id: "3",
    title: "Collection 3",
    imageUrl:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=400&fit=crop",
    videoCount: 30,
    isPublic: false,
    views: "20+",
  },
  {
    id: "4",
    title: "Action Movies",
    imageUrl:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=400&fit=crop",
    videoCount: 15,
    isPublic: true,
    views: "500",
  },
  {
    id: "5",
    title: "Comedy Collection",
    imageUrl:
      "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=800&h=400&fit=crop",
    videoCount: 8,
    isPublic: true,
    views: "250",
  },
  {
    id: "6",
    title: "Sci-Fi Favorites",
    imageUrl:
      "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=400&fit=crop",
    videoCount: 22,
    isPublic: false,
    views: "50+",
  },
  {
    id: "7",
    title: "Documentaries",
    imageUrl:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=400&fit=crop",
    videoCount: 12,
    isPublic: true,
    views: "180",
  },
  {
    id: "8",
    title: "Horror Night",
    imageUrl:
      "https://images.unsplash.com/photo-1512070679279-8988d32161be?w=800&h=400&fit=crop",
    videoCount: 18,
    isPublic: true,
    views: "320",
  },
  {
    id: "9",
    title: "Romance Collection",
    imageUrl:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&h=400&fit=crop",
    videoCount: 6,
    isPublic: false,
    views: "30+",
  },
  {
    id: "10",
    title: "Thriller Series",
    videoCount: 25,
    isPublic: true,
    views: "450",
  },
];

function RouteComponent() {
  return (
    <NestedLayout
      title="Collection"
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
          <IconPlus className="size-6 text-white" />
        </Button>
      }
    >
      <div className="flex flex-col gap-y-2 px-4">
        {COLLECTIONS.map((collection) => (
          <CollectionCard key={collection.id} item={collection} />
        ))}
      </div>
    </NestedLayout>
  );
}
