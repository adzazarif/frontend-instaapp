import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import PostCard from '../../components/post/PostCard';
import { usePostDetail } from '../../hooks/usePostDetail';
import { ArrowLeft } from 'lucide-react';

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { post, isLoading, error } = usePostDetail(id);

  return (
    <MainLayout>
      <div className="flex flex-col w-full max-w-[700px] mx-auto min-h-screen bg-white shadow-sm border-x border-gray-200">
        {/* Header */}
        <div className="flex items-center px-4 py-4 border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur-sm z-20">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-1.5 -ml-1.5 rounded-full hover:bg-zinc-100 transition-colors text-black"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-black tracking-tight">Post</h1>
        </div>

        <div className="flex-1 pb-10">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <span className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2">
              <p className="text-red-500 font-medium">{error}</p>
              <button onClick={() => navigate(-1)} className="text-sm font-semibold text-black hover:underline">
                Go back
              </button>
            </div>
          ) : post ? (
            <PostCard post={post} />
          ) : (
            <div className="flex justify-center py-20 text-zinc-500">
              Post not found.
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
