# Comment API Module

This module provides a comprehensive, production-ready comment system for the movie player. It follows SOLID principles, React best practices, and modern web development patterns.

## 📁 File Structure

```
src/apis/comment/
├── README.md                      # This file - Documentation
├── index.ts                       # Public exports (Facade Pattern)
├── commentApi.ts                  # Low-level API client functions
├── queryGetComments.ts            # React Query hook for fetching comments
├── mutationCreateComment.ts       # React Query mutation for creating comments
└── useInfiniteComments.ts         # Infinite scroll hook for pagination
```

## 🎯 Features

- ✅ Fetch comments with pagination
- ✅ Create top-level comments
- ✅ Create replies to comments
- ✅ Create nested replies (reply to a reply)
- ✅ Infinite scroll support
- ✅ Automatic cache invalidation
- ✅ Optimistic updates
- ✅ Error handling
- ✅ Loading states
- ✅ Type safety with TypeScript
- ✅ Authentication integration
- ✅ Rate limiting handling
- ✅ Forbidden words validation

## 🚀 Quick Start

### Basic Usage

```typescript
import { MovieComment } from "@/components/common/movies/MovieComment";

function PlayerPage() {
  const postId = "your-post-id";
  
  return <MovieComment postId={postId} />;
}
```

### Manual Integration

If you want to build your own comment UI:

```typescript
import { useQuery } from "@tanstack/react-query";
import { queryGetComments, useMutationCreateComment } from "@/apis/comment";

function CustomCommentSection({ postId }: { postId: string }) {
  // Fetch comments
  const { data, isLoading } = useQuery(
    queryGetComments({ post_id: postId, limit: 20 })
  );
  
  // Create comment mutation
  const createComment = useMutationCreateComment({
    onSuccess: () => alert("Comment posted!"),
    onError: (error) => alert("Failed to post comment"),
  });
  
  // Handle submit
  const handleSubmit = (content: string) => {
    createComment.mutate({
      post_id: postId,
      content: content,
      device: "Web",
      app_version: "1.0.0",
    });
  };
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {data?.data.list.map(comment => (
        <div key={comment.comment_id}>
          <p>{comment.user.nickname}: {comment.content}</p>
        </div>
      ))}
    </div>
  );
}
```

## 📚 API Reference

### Types

```typescript
// Main comment structure
interface Comment {
  comment_id: string;
  post_id: string;
  content: string;
  status: "pending" | "success";
  created_at: string;
  comment_like_count: number;
  is_liked: boolean;
  user: CommentUser;
  replies: {
    list: CommentReply[];
    replies_count: number;
    hasMore: boolean;
  };
}

// Reply structure
interface CommentReply {
  reply_id: string;
  comment_id: string;
  parent_id: string | null;
  reply_to: string;
  status: "pending" | "success";
  content: string;
  user: CommentUser;
  created_at: string;
  reply_like_count: number;
  is_liked: boolean;
}

// User information
interface CommentUser {
  user_id: string;
  username: string;
  nickname: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  status: string;
  referral_code: string;
}
```

### Hooks

#### `queryGetComments`

Fetches comments for a specific post with pagination.

```typescript
const { data, isLoading, error } = useQuery(
  queryGetComments({
    post_id: "123",
    limit: 20,
    last_comment_id: "optional-cursor-for-next-page"
  })
);
```

**Parameters:**
- `post_id` (required): The post ID to fetch comments for
- `limit` (optional): Number of comments per page (1-50, default: 20)
- `last_comment_id` (optional): Cursor for pagination

**Returns:**
```typescript
{
  status: boolean;
  message: string;
  data: {
    list: Comment[];
    comments_count: number;
    hasMore: boolean;
  };
}
```

#### `useMutationCreateComment`

Creates a new comment or reply.

```typescript
const createComment = useMutationCreateComment({
  onSuccess: () => {
    toast.success("Comment posted!");
  },
  onError: (error) => {
    toast.error("Failed to post comment");
  }
});

// Create a comment
createComment.mutate({
  post_id: "123",
  content: "Great post!",
  device: "iOS",
  app_version: "1.0.0"
});

// Create a reply
createComment.mutate({
  post_id: "123",
  comment_id: "456",
  content: "I agree!",
});

// Create a nested reply
createComment.mutate({
  post_id: "123",
  comment_id: "456",
  reply_id: "789",
  content: "Thanks!"
});
```

**Parameters:**
- `post_id` (required): The post ID
- `content` (required): The comment/reply text
- `comment_id` (optional): Required for replies
- `reply_id` (optional): Required for nested replies
- `device` (optional): Device type
- `app_version` (optional): App version

#### `useInfiniteComments`

Infinite scroll implementation for comments.

```typescript
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading
} = useInfiniteComments({
  postId: "123",
  limit: 20,
  enabled: true
});

// Flatten all pages
const allComments = data?.pages.flatMap(page => page.data.list) ?? [];
```

**Parameters:**
- `postId` (required): The post ID
- `limit` (optional): Comments per page (default: 20)
- `enabled` (optional): Whether to enable the query (default: true)

## 🏗️ Architecture & Design Patterns

### SOLID Principles

1. **Single Responsibility Principle (SRP)**
   - Each file has one clear purpose
   - `commentApi.ts` - API communication only
   - `queryGetComments.ts` - Query configuration only
   - `mutationCreateComment.ts` - Mutation logic only

2. **Open/Closed Principle (OCP)**
   - Components are open for extension (props, callbacks)
   - Closed for modification (internal logic is encapsulated)

3. **Liskov Substitution Principle (LSP)**
   - Comment and Reply types can be used interchangeably where applicable
   - All hooks follow React Query's interface contracts

4. **Interface Segregation Principle (ISP)**
   - Components only receive the props they need
   - No "god objects" with unnecessary properties

5. **Dependency Inversion Principle (DIP)**
   - Components depend on abstractions (React Query hooks)
   - Not on concrete implementations (axios calls)

### Design Patterns

1. **Facade Pattern**
   - `index.ts` provides a clean interface to the module
   - Hides internal complexity

2. **Observer Pattern**
   - React Query automatically notifies components of data changes
   - Automatic cache invalidation on mutations

3. **Strategy Pattern**
   - Different query strategies (basic, infinite, suspense)
   - Same API, different behaviors

4. **Command Pattern**
   - Mutations encapsulate operations as objects
   - Can be queued, cancelled, or retried

## 🔄 Data Flow

```
User Action (Comment Submit)
    ↓
useMutationCreateComment
    ↓
commentApi.createComment()
    ↓
API Request (POST /api/v1/post/comment)
    ↓
API Response
    ↓
Cache Invalidation
    ↓
queryGetComments Refetch
    ↓
UI Update (New Comment Appears)
```

## 🎨 UI Components

### MovieComment

The main component that integrates everything.

**Features:**
- Displays all comments with nested replies
- Handles comment creation and reply functionality
- Shows loading and error states
- Integrates with authentication
- Provides user feedback (toasts)

**Props:**
```typescript
interface MovieCommentProps {
  postId: string; // The post ID to display comments for
}
```

### CommentItem

Renders a single comment with its metadata and replies.

**Features:**
- User avatar and nickname
- Like count and button
- Timestamp
- Status badge (pending/approved)
- Reply button
- Expandable replies list

### ReplyItem

Renders a single reply to a comment.

**Features:**
- User avatar and nickname
- Reply-to indicator
- Like count and button
- Timestamp
- Status badge

## 🛡️ Error Handling

The system handles various error scenarios:

### API Errors

| Status Code | Error | Handling |
|------------|-------|----------|
| 401 | Unauthorized | Show "Please login to comment" |
| 409 | Rate limit | Show "Please wait before commenting again" |
| 400 | Forbidden words | Show "Your comment contains forbidden words" |
| 422 | Validation error | Show specific field error |

### Network Errors

- Automatic retry (2 attempts)
- Loading states during retry
- Error messages with retry option

### Edge Cases

- Empty comments list - Shows "Be the first to comment!"
- No video URL - Shows loading screen
- Missing user avatar - Uses placeholder
- Failed image loads - Graceful fallbacks

## 🚀 Performance Optimizations

1. **React Query Caching**
   - Comments cached for 30 seconds (staleTime)
   - Garbage collection after 5 minutes (gcTime)
   - Background refetching for fresh data

2. **Memoization**
   - Video layers memoized to prevent player restarts
   - Tab components memoized with unique keys

3. **Optimistic Updates**
   - UI updates immediately on comment submit
   - Rolls back if API call fails

4. **Cursor-Based Pagination**
   - Efficient pagination with consistent results
   - No page drift issues

5. **Code Splitting**
   - Components lazy-loaded when needed
   - Reduces initial bundle size

## 🧪 Testing Considerations

### Unit Tests

Test individual functions:
```typescript
describe("commentApi", () => {
  it("should fetch comments", async () => {
    const result = await fetchComments({ post_id: "123" });
    expect(result.status).toBe(true);
  });
});
```

### Integration Tests

Test hooks with React Query:
```typescript
describe("queryGetComments", () => {
  it("should fetch and cache comments", async () => {
    const { result } = renderHook(
      () => useQuery(queryGetComments({ post_id: "123" })),
      { wrapper: QueryClientProvider }
    );
    
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
```

### E2E Tests

Test user flows:
```typescript
describe("Comment Flow", () => {
  it("should allow user to post a comment", async () => {
    // 1. Navigate to player page
    // 2. Switch to comments tab
    // 3. Type comment
    // 4. Submit comment
    // 5. Verify comment appears
  });
});
```

## 📝 Best Practices

1. **Always handle loading states**
   ```typescript
   if (isLoading) return <Spinner />;
   ```

2. **Always handle error states**
   ```typescript
   if (isError) return <ErrorMessage error={error} />;
   ```

3. **Use proper TypeScript types**
   ```typescript
   const comment: Comment = data.data.list[0];
   ```

4. **Provide user feedback**
   ```typescript
   toast.success("Comment posted!");
   toast.error("Failed to post comment");
   ```

5. **Clean up on unmount**
   ```typescript
   useEffect(() => {
     return () => {
       // Cleanup code
     };
   }, []);
   ```

## 🔐 Security Considerations

1. **Authentication Required**
   - Comments require Bearer token
   - Token validated on server

2. **Content Validation**
   - Forbidden words checked server-side
   - HTML sanitization if displaying rich content

3. **Rate Limiting**
   - 30-second cooldown between comments
   - Prevents spam and abuse

4. **XSS Prevention**
   - Use React's built-in escaping
   - Never use `dangerouslySetInnerHTML` for user content

## 📊 Monitoring & Analytics

Consider tracking:
- Comment creation success/failure rates
- Average time to post a comment
- Most active comment threads
- Reply depth distribution
- Error rates by type

## 🔮 Future Enhancements

Potential improvements:
- [ ] Comment editing
- [ ] Comment deletion
- [ ] Like/unlike comments
- [ ] Report comments
- [ ] Rich text formatting
- [ ] Emoji picker
- [ ] @ mentions
- [ ] Image attachments
- [ ] Real-time updates (WebSocket)
- [ ] Comment notifications
- [ ] Moderation tools
- [ ] Comment analytics

## 🤝 Contributing

When adding new features:
1. Follow existing patterns
2. Add TypeScript types
3. Document with JSDoc comments
4. Write tests
5. Update this README

## 📞 Support

For issues or questions:
- Check the API documentation (`api.md`)
- Review existing code examples
- Create an issue in the project repository

