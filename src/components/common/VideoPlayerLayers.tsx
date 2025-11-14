// Example layer components for VideoPlayer
import type { Comment } from "@/data/mockComments";
import { useEffect, useState } from "react";

interface WatermarkLayerProps {
  text: string;
}

export function WatermarkLayer({ text }: WatermarkLayerProps) {
  return (
    <div className="pointer-events-none absolute top-4 right-4 opacity-50">
      <span className="text-sm text-white">{text}</span>
    </div>
  );
}

interface BulletCommentLayerProps {
  comments: Comment[];
}

interface ActiveComment extends Comment {
  id: number;
  animationId: string;
  top: number;
}

export function BulletCommentLayer({ comments }: BulletCommentLayerProps) {
  const [activeComments, setActiveComments] = useState<ActiveComment[]>([]);
  const [commentQueue, setCommentQueue] = useState<Comment[]>([]);

  useEffect(() => {
    // Initialize comment queue with top-level comments only (no replies)
    const topLevelComments = comments.filter(
      (comment) => !comment.replies || comment.replies.length === 0 || true,
    );
    setCommentQueue(topLevelComments);
  }, [comments]);

  useEffect(() => {
    if (commentQueue.length === 0) return;

    // Add a new comment every 2-4 seconds
    const interval = setInterval(
      () => {
        if (commentQueue.length > 0) {
          const nextComment =
            commentQueue[Math.floor(Math.random() * commentQueue.length)];
          const animationId = `comment-${Date.now()}-${Math.random()}`;
          const top = Math.random() * 60 + 10; // Random position between 10% and 70%

          setActiveComments((prev) => [
            ...prev,
            { ...nextComment, animationId, top },
          ]);

          // Remove comment after animation completes (10 seconds)
          setTimeout(() => {
            setActiveComments((prev) =>
              prev.filter((c) => c.animationId !== animationId),
            );
          }, 10000);
        }
      },
      Math.random() * 2000 + 2000,
    ); // Random interval between 2-4 seconds

    return () => clearInterval(interval);
  }, [commentQueue]);

  return (
    <div className="pointer-events-none absolute inset-0 h-20 overflow-hidden">
      {activeComments.map((comment) => (
        <div
          key={comment.animationId}
          className="animate-bullet-comment absolute whitespace-nowrap"
          style={{
            top: `${comment.top}%`,
            right: "-100%",
            animation: "bullet-comment 10s linear forwards",
          }}
        >
          <div className="flex items-center gap-2 rounded-full px-4 py-2">
            <img
              src={comment.avatar}
              alt={comment.author}
              className="h-6 w-6 rounded-full"
            />
            <span className="text-sm font-medium text-white">
              {comment.author}:
            </span>
            <span className="text-sm text-white/90">{comment.text}</span>
          </div>
        </div>
      ))}
      <style>{`
        @keyframes bullet-comment {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(-100vw - 100%));
          }
        }
        .animate-bullet-comment {
          animation: bullet-comment 10s linear forwards;
        }
      `}</style>
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
    <div className="absolute right-0 bottom-20 left-0 flex items-center justify-between px-4">
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
    <div className="absolute top-4 left-4 max-w-md">
      {title && (
        <h2 className="text-lg font-bold text-white drop-shadow-lg">{title}</h2>
      )}
      {episode && (
        <p className="text-sm text-white/80 drop-shadow-lg">{episode}</p>
      )}
    </div>
  );
}
