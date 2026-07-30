import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { useLike } from '../../hooks/useLike';
import { useComments } from '../../hooks/useComments';
import { useAuthContext } from '../../context/AuthContext';
import { deletePost } from '../../api/postApi';

function timeAgo(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return `${seconds} detik yang lalu`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} menit yang lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam yang lalu`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} hari yang lalu`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function PostCard({ post }) {
  const { currentUser } = useAuthContext();
  const navigate = useNavigate();
  const isOwner = currentUser?.username === post.user.username;
  const { isLiked, likeCount, toggleLike, isLoading: isLikeLoading } = useLike(post);
  const {
    comments,
    commentCount,
    isLoading: isCommentsLoading,
    isSubmitting,
    hasFetched,
    fetchComments,
    submitComment,
    removeComment
  } = useComments(post.id, post.commentCount);

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggleComments = () => {
    if (!showComments && !hasFetched) {
      fetchComments();
    }
    setShowComments(!showComments);
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const success = await submitComment(commentText);
    if (success) {
      setCommentText('');
      if (!showComments) {
        setShowComments(true);
        if (!hasFetched) fetchComments();
      }
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await deletePost(post.id);
      // Reload page to reflect deletion if we don't have local state management for Feed
      window.location.reload();
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post.');
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === post.images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? post.images.length - 1 : prev - 1));
  };

  return (
    <article className="bg-white sm:border sm:border-gray-200 sm:rounded-xl sm:shadow-[0_2px_8px_rgba(0,0,0,0.04)] sm:mb-8 mb-2 pb-5 pt-1 overflow-visible border-b border-gray-100 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 sm:py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-zinc-200 overflow-hidden cursor-pointer border border-gray-100 ring-2 ring-transparent hover:ring-zinc-200 transition-all">
            {post.user.avatar ? (
              <img src={post.user.avatar} className="w-full h-full object-cover" alt={post.user.username} />
            ) : null}
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[14.5px] font-bold text-zinc-900 cursor-pointer hover:text-zinc-500 transition-colors tracking-tight leading-tight">
              {post.user.username}
            </span>
            {post.location && <span className="text-[12px] text-zinc-500 leading-tight mt-0.5">{post.location}</span>}
          </div>
        </div>
        <div className="relative" ref={menuRef}>

          {isOwner && (
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-zinc-600 p-1.5 rounded-full hover:bg-zinc-100 hover:text-black transition-colors"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          )}

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-gray-100 py-1 z-50 flex flex-col overflow-hidden">
              {isOwner && (
                <button
                  onClick={() => {
                    setShowMenu(false);
                    navigate(`/post/${post.id}/edit`);
                  }}
                  className="px-4 py-2.5 text-left text-[14px] text-black hover:bg-zinc-50 transition-colors"
                >
                  Edit
                </button>
              )}

              {isOwner && (
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowDeleteModal(true);
                  }}
                  className="px-4 py-2.5 text-left text-[14px] text-red-500 hover:bg-red-50 font-bold border-t border-gray-50 transition-colors"
                >
                  Hapus
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Image Slider */}
      <div className="w-full bg-zinc-50 aspect-square sm:aspect-[4/5] flex items-center justify-center overflow-hidden border-y border-gray-50 relative group">
        {post.images && post.images.length > 0 ? (
          <>
            <img src={post.images[currentImageIndex]} className="w-full h-full object-cover transition-opacity duration-300" alt={`Post ${currentImageIndex + 1}`} />

            {/* Slider Controls */}
            {post.images.length > 1 && (
              <>
                {/* Numeric Counter (Top Right) */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  {currentImageIndex + 1} / {post.images.length}
                </div>

                {/* Prev Button */}
                {currentImageIndex > 0 && (
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                  </button>
                )}

                {/* Next Button */}
                {currentImageIndex < post.images.length - 1 && (
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                  </button>
                )}

                {/* Dots Indicator Wrapper with subtle bottom gradient for visibility on white images */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
                  {post.images.map((_, idx) => (
                    <div
                      key={idx}
                      className={clsx(
                        "w-1.5 h-1.5 rounded-full transition-all duration-300 shadow-[0_0_3px_rgba(0,0,0,0.5)]",
                        idx === currentImageIndex ? "bg-white scale-125" : "bg-white/60"
                      )}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="text-zinc-400 text-sm font-medium">No Image</div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3 sm:py-3.5">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleLike}
            disabled={isLikeLoading}
            className="flex items-center gap-1.5 hover:opacity-60 transition-all active:scale-90 disabled:opacity-50 group"
          >
            <Heart className={clsx('w-6 h-6 transition-colors', isLiked ? 'fill-red-500 text-red-500' : 'text-zinc-900')} strokeWidth={isLiked ? 2 : 2.5} />
            {likeCount > 0 && <span className="text-[14.5px] font-bold text-black">{likeCount.toLocaleString()}</span>}
          </button>
          <button onClick={handleToggleComments} className="flex items-center gap-1.5 hover:opacity-60 transition-all active:scale-90">
            <MessageCircle className="w-6 h-6 text-zinc-900 -scale-x-100" strokeWidth={2.5} />
            {commentCount > 0 && <span className="text-[14.5px] font-bold text-black">{commentCount.toLocaleString()}</span>}
          </button>
          <button className="hover:opacity-60 transition-all active:scale-90">
            <Send className="w-6 h-6 text-zinc-900" strokeWidth={2.5} />
          </button>
        </div>
        <button className="hover:opacity-60 transition-all active:scale-90">
          <Bookmark className="w-6 h-6 text-zinc-900" strokeWidth={2.5} />
        </button>
      </div>

      {/* Caption */}
      {post.caption && (
        <div className="px-4 text-[14.5px] text-zinc-900 leading-relaxed mb-1.5">
          <span className="font-bold mr-2 cursor-pointer hover:text-zinc-500 transition-colors tracking-tight">{post.user.username}</span>
          {post.caption}
        </div>
      )}

      {/* Comments Toggle */}
      {commentCount > 0 && (
        <div className="px-4 mt-1">
          <button
            onClick={handleToggleComments}
            className="text-[14.5px] text-zinc-500 hover:text-zinc-400 transition-colors font-medium"
          >
            {showComments ? 'Hide comments' : `View all ${commentCount} comments`}
          </button>
        </div>
      )}

      {/* Comments List */}
      {showComments && (
        <div className="px-4 mt-2 space-y-1.5">
          {isCommentsLoading ? (
            <div className="text-[14px] text-zinc-500">Loading comments...</div>
          ) : (
            comments.map(comment => {
              const isCommentOwner = currentUser?.username === comment.user.username;
              const canDeleteComment = isOwner || isCommentOwner;

              return (
                <div key={comment.id} className="text-[14.5px] text-zinc-900 leading-relaxed flex items-start justify-between group">
                  <div>
                    <span className="font-bold mr-2 cursor-pointer hover:text-zinc-500 transition-colors tracking-tight">
                      {comment.user.username}
                    </span>
                    {comment.content}
                  </div>
                  {canDeleteComment && (
                    <button
                      onClick={() => removeComment(comment.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-red-500 transition-all shrink-0 ml-4 active:scale-90"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Date */}
      {post.createdAt && (
        <div className="px-4 mt-2 mb-3">
          <span className="text-[11px] uppercase text-zinc-500 font-medium tracking-wider">
            {timeAgo(post.createdAt)}
          </span>
        </div>
      )}

      {/* Add comment input */}
      <form onSubmit={handlePostComment} className="px-4 mt-1 flex items-center border-t border-gray-100 pt-3 pb-1">
        <input
          type="text"
          placeholder="Add a comment..."
          className="w-full text-[14.5px] outline-none bg-transparent placeholder:text-zinc-500"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className="text-[14px] font-bold text-blue-500 hover:text-blue-700 disabled:text-blue-300 disabled:opacity-50 transition-colors ml-3"
          disabled={!commentText.trim() || isSubmitting}
        >
          {isSubmitting ? 'Posting...' : 'Post'}
        </button>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col">
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold text-black mb-2">Hapus Postingan?</h3>
              <p className="text-sm text-zinc-500">
                Apakah Anda yakin ingin menghapus postingan ini? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex flex-col border-t border-gray-100">
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="py-3.5 text-red-500 font-bold hover:bg-zinc-50 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isDeleting ? (
                  <span className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  'Hapus'
                )}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="py-3.5 text-black hover:bg-zinc-50 border-t border-gray-100 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
