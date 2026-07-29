import PostCard from './PostCard';
import { usePosts } from '../../hooks/usePosts';

export default function PostList() {
  const { posts, isLoading, error } = usePosts();

  if (isLoading && posts.length === 0) {
    return (
      <div className="flex flex-col w-full max-w-[600px] mx-auto pb-10 items-center justify-center py-10">
        <span className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col w-full max-w-[600px] mx-auto pb-10 text-center py-10 text-red-500">
        {error}
      </div>
    );
  }

  if (!isLoading && posts.length === 0) {
    return (
      <div className="flex flex-col w-full max-w-[600px] mx-auto pb-10 text-center py-10 text-gray-500">
        No posts yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-[600px] mx-auto pb-10">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
