import CollectionCover from "@/assets/img/collection-cover.png";
import IconPlay from "@/assets/svgs/icon-play.svg?react";
import IconStar from "@/assets/svgs/icon-star-fill.svg?react";
import { Button } from "@/components/ui/button";
import type { CollectionItem } from "@/types/collection";

interface CollectionItemCardProps {
  item: CollectionItem;
}

function CollectionItemCard({ item }: CollectionItemCardProps) {
  return (
    <div className="grid w-full grid-cols-12 items-center gap-x-3">
      {/* Image Container */}
      <div className="relative col-span-4 aspect-[3/2] overflow-hidden rounded-md">
        <img
          src={item.imageUrl ?? CollectionCover}
          alt={item.title}
          className="h-full w-full object-cover"
        />

        {!!item.resolution && (
          <div className="absolute top-0 right-0 px-2.5 py-0.5">
            {item.resolution}
          </div>
        )}
      </div>

      <div className="col-span-8 flex items-center justify-between text-white">
        <div className="space-y-2">
          <p className="line-clamp-1 text-lg font-medium">{item.title}</p>
          <div className="flex items-center">
            <p className="text-sm">{item.episodes} Full</p>
            <div className="mx-2 h-5 border border-l border-white/12"></div>
            <p className="text-sm">{item.typeDesc}</p>
          </div>
          <div className="flex items-center gap-x-2">
            <p className="text-sm">{item.rating.toFixed(1)}</p>
            <IconStar className="size-4 text-neutral-50" />
          </div>
        </div>

        <Button
          type="button"
          size={"icon"}
          variant={"ghost"}
          onClick={() => {
            console.log("action clicked");
          }}
          className="rounded-full border border-white/10 backdrop-blur-xs"
        >
          <IconPlay className="size-6 text-white" />
        </Button>
      </div>
    </div>
  );
}

export default CollectionItemCard;
