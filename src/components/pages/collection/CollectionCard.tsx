import CollectionCover from "@/assets/img/collection-cover.png";
import IconHeart from "@/assets/svgs/icon-heart.svg?react";
import type { Collection } from "@/types/collection";
import { GlobeIcon, LockIcon } from "lucide-react";

interface CollectionCardProps {
  item: Collection & { isDefault?: boolean };
}

function CollectionCard({ item }: CollectionCardProps) {
  return (
    <div className="grid w-full grid-cols-12 items-center gap-x-3 rounded-xl border-1 border-white/10 bg-white/1 p-3">
      {/* Image Container */}
      <div className="relative col-span-4 aspect-[3/2] overflow-hidden rounded-md">
        {!item.isDefault ? (
          <img
            src={item.imageUrl ?? CollectionCover}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-[#EA177D52]"></div>
        )}

        {item.isDefault && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-[4px]">
              <IconHeart className="size-6 text-white" />
            </div>
          </div>
        )}
      </div>

      <div className="col-span-8 flex justify-between text-white">
        <div className="space-y-2">
          <p className="text-lg font-medium">{item.title}</p>
          <div className="flex items-center">
            <p className="text-sm">{item.videoCount} Videos</p>
            <div className="mx-2 h-5 border-[1px] border-l border-white/12"></div>
            <div className="flex items-center gap-x-1 text-[#888888]">
              {item.isPublic ? (
                <GlobeIcon className="size-4" />
              ) : (
                <LockIcon className="size-4" />
              )}
              <p className="text-sm">{item.isPublic ? "Public" : "Private"}</p>
            </div>
          </div>
        </div>
        <p className="text-sm">{item.views} views</p>
      </div>
    </div>
  );
}

export default CollectionCard;
