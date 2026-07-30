import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { updatePost } from '../../api/postApi';
import { usePostDetail } from '../../hooks/usePostDetail';
import { Image as ImageIcon, Loader2, ArrowLeft } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';

export default function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuthContext();
  const { post, isLoading: isPostLoading, error: postError } = usePostDetail(id);

  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (post) {
      setCaption(post.caption || '');
    }
  }, [post]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await updatePost(id, { caption });
      navigate(`/post/${id}`);
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to update post.';
      setError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If post loaded and user is not owner, redirect or show error
  if (!isPostLoading && post && currentUser?.username !== post.user.username) {
    return (
      <MainLayout>
        <div className="flex flex-col w-full max-w-[600px] mx-auto min-h-screen bg-white items-center justify-center">
          <p className="text-red-500 font-bold mb-4">You are not authorized to edit this post.</p>
          <button onClick={() => navigate('/')} className="text-sm font-semibold hover:underline">Return to Home</button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col w-full max-w-[600px] mx-auto min-h-screen bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur-sm z-10">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)}
              className="mr-4 p-1.5 -ml-1.5 rounded-full hover:bg-zinc-100 transition-colors text-black"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-black tracking-tight">Edit post</h1>
          </div>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting || isPostLoading}
            className="text-sm font-semibold text-blue-500 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Done
          </button>
        </div>

        <div className="p-4 flex-1">
          {isPostLoading ? (
             <div className="flex justify-center py-20">
               <span className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></span>
             </div>
          ) : postError ? (
            <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100 text-center">
              {postError}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
                  {error}
                </div>
              )}

              {/* Image Preview (Read Only) */}
              <div>
                {post?.images?.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                    {post.images.map((img, index) => (
                      <div key={index} className="relative aspect-square rounded-md overflow-hidden bg-zinc-100 border border-gray-200">
                        <img src={img} alt="post content" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Caption Section */}
              <div className="flex gap-3 border-t border-gray-100 pt-6">
                <div className="w-8 h-8 rounded-full bg-zinc-200 overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center">
                  {currentUser?.avatar ? (
                     <img src={currentUser.avatar} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                     <ImageIcon className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write a caption..."
                  className="w-full min-h-[100px] resize-none outline-none text-sm text-black placeholder:text-gray-400 pt-1.5"
                  maxLength={2200}
                />
              </div>
            </form>
          )}
        </div>
      </div>
      
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-black mb-4" />
          <p className="text-sm font-medium text-black">Updating...</p>
        </div>
      )}
    </MainLayout>
  );
}
