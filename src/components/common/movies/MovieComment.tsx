import HeartOutline from "@/assets/svgs/icon-heart-outline.svg?react";
import Send from "@/assets/svgs/icon-send.svg?react";
import { mockComments, type Comment } from "@/data/mockComments";
import { useState } from "react";

interface CommentItemProps {
  comment: Comment;
  isChild?: boolean;
}

function CommentItem({ comment, isChild = false }: CommentItemProps) {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div className="mx-4 text-white">
      <div className="mb-2 flex items-start gap-2">
        <img
          src={comment.avatar}
          alt={comment.author}
          width="40"
          height="40"
          className="rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <strong>{comment.author}</strong>
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-400">{comment.likesCount}</span>
              <HeartOutline className="h-5 w-5 cursor-pointer" />
            </div>
            {/* <button>{comment.isLiked ? "Unlike" : "Like"}</button> */}
          </div>
          <p className="text-sm font-thin">{comment.text}</p>
          <small>{new Date(comment.timestamp).toLocaleString()}</small>
          {!isChild && comment.replies && comment.replies.length > 0 && (
            <button
              className="ml-4 text-sm text-blue-400"
              onClick={() => setShowReplies(!showReplies)}
            >
              {showReplies ? "Hide" : "View"} {comment.replies.length} Repl
              {comment.replies.length === 1 ? "y" : "ies"}
            </button>
          )}
        </div>
      </div>
      {showReplies &&
        comment.replies &&
        comment.replies.map((reply) => (
          <CommentItem key={reply.id} comment={reply} isChild={true} />
        ))}
    </div>
  );
}

export function MovieComment() {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = () => {
    // Placeholder for submitting new comment
    console.log("New comment:", newComment);
    setNewComment("");
  };

  return (
    <div className="overflow-y-scroll">
      {mockComments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
      <div className="bg-accent-foreground absolute right-0 bottom-0 left-0 flex items-center gap-2 p-4 text-white">
        <img
          src="https://avatars.steamstatic.com/fa756ff3c17205f0da5dfbf47ec8ed160b877015_full.jpg"
          alt="User avatar"
          width="35"
          height="35"
          className="rounded-full"
        />
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 rounded border border-white/20 bg-transparent px-4 py-2 text-white outline-none"
        />
        <button className="cursor-pointer" onClick={handleSubmit}>
          <Send className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
