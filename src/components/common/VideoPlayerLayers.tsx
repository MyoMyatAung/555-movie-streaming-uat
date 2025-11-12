// Example layer components for VideoPlayer

interface WatermarkLayerProps {
  text: string;
}

export function WatermarkLayer({ text }: WatermarkLayerProps) {
  return (
    <div className="pointer-events-none absolute right-4 top-4 opacity-50">
      <span className="text-sm text-white">{text}</span>
    </div>
  );
}

interface LoadingLayerProps {
  isLoading: boolean;
}

export function LoadingLayer({ isLoading }: LoadingLayerProps) {
  if (!isLoading) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent" />
    </div>
  );
}

interface CustomControlLayerProps {
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export function CustomControlLayer({
  onNext,
  onPrevious,
  hasNext = false,
  hasPrevious = false,
}: CustomControlLayerProps) {
  return (
    <div className="absolute bottom-20 left-0 right-0 flex items-center justify-between px-4">
      <button
        onClick={onPrevious}
        disabled={!hasPrevious}
        className="rounded-full bg-white/20 px-4 py-2 text-white backdrop-blur-sm transition-all hover:bg-white/30 disabled:opacity-50"
      >
        Previous Episode
      </button>
      <button
        onClick={onNext}
        disabled={!hasNext}
        className="rounded-full bg-white/20 px-4 py-2 text-white backdrop-blur-sm transition-all hover:bg-white/30 disabled:opacity-50"
      >
        Next Episode
      </button>
    </div>
  );
}

interface InfoLayerProps {
  title?: string;
  episode?: string;
}

export function InfoLayer({ title, episode }: InfoLayerProps) {
  return (
    <div className="absolute left-4 top-4 max-w-md">
      {title && <h2 className="text-lg font-bold text-white drop-shadow-lg">{title}</h2>}
      {episode && <p className="text-sm text-white/80 drop-shadow-lg">{episode}</p>}
    </div>
  );
}
