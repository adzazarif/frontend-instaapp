import MainLayout from '../../components/layout/MainLayout';
import StoryBar from '../../components/story/StoryBar';
import PostList from '../../components/post/PostList';
import { useAuthContext } from '../../context/AuthContext';

export default function FeedPage() {
  const { currentUser } = useAuthContext();

  return (
    <MainLayout>
      {/* Greeting (Optional, but kept for context) */}
      <div className="px-4 py-4 md:py-6 bg-white border-b border-gray-100 hidden md:block">
        <h2 className="text-xl font-bold text-black tracking-tight">
          Welcome back, {currentUser?.name || 'User'}!
        </h2>
        <p className="text-zinc-500 text-sm">Here's what your friends are up to today.</p>
      </div>

      {/* Story Bar Section */}
      <StoryBar />

      {/* Posts Section */}
      <div className="py-6">
        <PostList />
      </div>
    </MainLayout>
  );
}
