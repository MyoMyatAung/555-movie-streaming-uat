# Comment System - Quick Start Guide

## 🚀 5-Minute Integration

### Step 1: Import the Component

```typescript
import { MovieComment } from "@/components/common/movies/MovieComment";
```

### Step 2: Use in Your Page

```typescript
function PlayerPage() {
  const postId = "your-post-id-here";
  
  return (
    <div>
      <MovieComment postId={postId} />
    </div>
  );
}
```

That's it! The component handles everything else automatically.

## 📚 Common Use Cases

### Use Case 1: Display Comments Only

```typescript
import { useQuery } from "@tanstack/react-query";
import { queryGetComments } from "@/apis/comment";

function CommentsDisplay({ postId }: { postId: string }) {
  const { data, isLoading } = useQuery(
    queryGetComments({ post_id: postId, limit: 20 })
  );
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {data?.data.list.map(comment => (
        <div key={comment.comment_id}>
          <p><strong>{comment.user.nickname}</strong></p>
          <p>{comment.content}</p>
        </div>
      ))}
    </div>
  );
}
```

### Use Case 2: Create Comment Form

```typescript
import { useState } from "react";
import { useMutationCreateComment } from "@/apis/comment";
import { toast } from "sonner";

function CommentForm({ postId }: { postId: string }) {
  const [content, setContent] = useState("");
  
  const createComment = useMutationCreateComment({
    onSuccess: () => {
      setContent("");
      toast.success("Comment posted!");
    },
    onError: () => {
      toast.error("Failed to post comment");
    }
  });
  
  const handleSubmit = () => {
    createComment.mutate({
      post_id: postId,
      content: content,
      device: "Web",
      app_version: "1.0.0"
    });
  };
  
  return (
    <div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
      />
      <button onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}
```

### Use Case 3: Infinite Scroll

```typescript
import { useInfiniteComments } from "@/apis/comment";
import { useEffect, useRef } from "react";

function InfiniteCommentsList({ postId }: { postId: string }) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteComments({ postId, limit: 20 });
  
  const observerRef = useRef<IntersectionObserver>();
  
  const lastCommentRef = useCallback((node: HTMLDivElement) => {
    if (isFetchingNextPage) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);
  
  const allComments = data?.pages.flatMap(page => page.data.list) ?? [];
  
  return (
    <div>
      {allComments.map((comment, index) => {
        const isLast = index === allComments.length - 1;
        return (
          <div
            key={comment.comment_id}
            ref={isLast ? lastCommentRef : undefined}
          >
            <p>{comment.content}</p>
          </div>
        );
      })}
      {isFetchingNextPage && <div>Loading more...</div>}
    </div>
  );
}
```

## 🎯 Key Concepts

### 1. Post ID
Every comment belongs to a post. Always provide the `postId`:

```typescript
<MovieComment postId={id} />
```

### 2. Authentication
Comments require authentication. The component automatically:
- Checks if user is logged in
- Shows login prompt if not authenticated
- Includes auth token in requests

### 3. Comment Status
Comments have two statuses:
- `"pending"` - Awaiting approval
- `"success"` - Approved and visible

### 4. Pagination
Use cursor-based pagination:

```typescript
// First page
queryGetComments({ post_id: "123", limit: 20 })

// Next page
queryGetComments({
  post_id: "123",
  limit: 20,
  last_comment_id: "last-comment-id-from-previous-page"
})
```

### 5. Replies
Create replies by providing `comment_id`:

```typescript
createComment.mutate({
  post_id: "123",
  comment_id: "456", // The comment to reply to
  content: "I agree!"
});
```

## ⚠️ Common Mistakes

### ❌ Wrong: Using without post ID
```typescript
<MovieComment /> // Missing postId prop
```

### ✅ Correct: Always provide post ID
```typescript
<MovieComment postId={postId} />
```

---

### ❌ Wrong: Not handling loading state
```typescript
const { data } = useQuery(queryGetComments({ post_id }));
return <div>{data.data.list.map(...)}</div> // Crashes if data is undefined
```

### ✅ Correct: Handle loading and error states
```typescript
const { data, isLoading, isError } = useQuery(queryGetComments({ post_id }));
if (isLoading) return <div>Loading...</div>;
if (isError) return <div>Error loading comments</div>;
return <div>{data.data.list.map(...)}</div>
```

---

### ❌ Wrong: Forgetting to invalidate cache
```typescript
createComment.mutate({ ... }); // Cache not updated
```

### ✅ Correct: Use the mutation hook
```typescript
// The hook automatically invalidates cache on success
const createComment = useMutationCreateComment();
```

## 🐛 Debugging Tips

### Problem: Comments not showing
1. Check post ID is valid
2. Verify API endpoint is correct
3. Check network tab for errors
4. Ensure post has comments

### Problem: Can't submit comment
1. Verify user is logged in
2. Check for empty content
3. Wait for rate limit (30 seconds)
4. Check for forbidden words

### Problem: Comments not updating
1. Check React Query DevTools
2. Verify cache invalidation
3. Force refresh with `refetch()`
4. Check for JavaScript errors

## 📖 Further Reading

- Full Documentation: `src/apis/comment/README.md`
- API Types: `src/types/comment.ts`
- Component Source: `src/components/common/movies/MovieComment.tsx`
- API Endpoints: `api.md` (search for "comment")

## 💡 Pro Tips

1. **Use React Query DevTools** for debugging
   ```typescript
   import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
   ```

2. **Enable keyboard shortcuts**
   ```typescript
   <input
     onKeyDown={(e) => {
       if (e.key === 'Enter' && !e.shiftKey) {
         handleSubmit();
       }
     }}
   />
   ```

3. **Show character count**
   ```typescript
   <div>{content.length} / 2000 characters</div>
   ```

4. **Debounce search/filter**
   ```typescript
   import { useDebouncedValue } from '@/hooks/useDebounce';
   const debouncedSearch = useDebouncedValue(search, 300);
   ```

5. **Cache timing**
   - Stale time: 30 seconds (data considered fresh)
   - GC time: 5 minutes (unused data removed)

## 🎓 Learning Path

1. ✅ Read this Quick Start
2. ✅ Try the examples above
3. ✅ Look at `MovieComment` component
4. ✅ Read full documentation
5. ✅ Study API types
6. ✅ Check API endpoints

## 🚀 Next Steps

Now that you understand the basics:
1. Customize the UI to match your design
2. Add additional features (edit, delete, etc.)
3. Implement real-time updates
4. Add analytics tracking
5. Write tests for your implementation

---

**Need Help?**
- Check the full documentation: `README.md`
- Review the API docs: `api.md`
- Look at working example: `src/routes/player/$id.tsx`

