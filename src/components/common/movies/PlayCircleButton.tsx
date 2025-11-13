import PlayIcon from "@/assets/svgs/icon-play.svg?react";

const PlayCircleButton = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100">
      <div className="flex size-10 items-center justify-center rounded-full bg-black/30 backdrop-blur-[1px]">
        <PlayIcon className="size-6 text-white" />
      </div>
    </div>
  );
};

export default PlayCircleButton;
