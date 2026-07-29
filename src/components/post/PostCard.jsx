import { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import clsx from 'clsx';
import { useLike } from '../../hooks/useLike';
import { useComments } from '../../hooks/useComments';
import { useAuthContext } from '../../context/AuthContext';

export default function PostCard({ post }) {
  const { currentUser } = useAuthContext();
  const { isLiked, likeCount, toggleLike, isLoading: isLikeLoading } = useLike(post);
  const {
    comments,
    commentCount,
    isLoading: isCommentsLoading,
    isSubmitting,
    hasFetched,
    fetchComments,
    submitComment
  } = useComments(post.id, post.commentCount);

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  
  const [showMenu, setShowMenu] = useState(false);
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

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === post.images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? post.images.length - 1 : prev - 1));
  };

  return (
    <article className="border-b border-gray-100 bg-white pb-6 pt-2 last:border-b-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-200 overflow-hidden cursor-pointer border border-gray-100">
            {post.user.avatar ? (
              <img src={post.user.avatar} className="w-full h-full object-cover" alt={post.user.username} />
            ) : null}
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] font-semibold text-black cursor-pointer hover:text-zinc-600 transition-colors leading-tight">
              {post.user.username}
            </span>
            {post.location && <span className="text-[12px] text-zinc-500 leading-tight">{post.location}</span>}
          </div>
        </div>
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="text-zinc-800 p-1 hover:text-zinc-500 transition-colors"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-gray-100 py-1 z-50 flex flex-col overflow-hidden">
              <button className="px-4 py-2.5 text-left text-[14px] text-black hover:bg-zinc-50 transition-colors">
                Edit
              </button>
              <button className="px-4 py-2.5 text-left text-[14px] text-black hover:bg-zinc-50 transition-colors">
                Archive
              </button>
              <button className="px-4 py-2.5 text-left text-[14px] text-red-500 hover:bg-red-50 font-bold border-t border-gray-50 transition-colors">
                Hapus
              </button>
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
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-5">
          <button
            onClick={toggleLike}
            disabled={isLikeLoading}
            className="flex items-center gap-1.5 hover:opacity-50 transition-opacity disabled:opacity-50 group"
          >
            <Heart className={clsx('w-[26px] h-[26px]', isLiked ? 'fill-red-500 text-red-500' : 'text-zinc-900')} />
            {likeCount > 0 && <span className="text-[14px] font-bold text-black">{likeCount.toLocaleString()}</span>}
          </button>
          <button onClick={handleToggleComments} className="flex items-center gap-1.5 hover:opacity-50 transition-opacity">
            <MessageCircle className="w-[26px] h-[26px] text-zinc-900 -scale-x-100" />
            {commentCount > 0 && <span className="text-[14px] font-bold text-black">{commentCount.toLocaleString()}</span>}
          </button>
          <button className="hover:opacity-50 transition-opacity">
            <Send className="w-[26px] h-[26px] text-zinc-900" />
          </button>
        </div>
        <button className="hover:opacity-50 transition-opacity">
          <Bookmark className="w-[26px] h-[26px] text-zinc-900" />
        </button>
      </div>

      {/* Caption */}
      {post.caption && (
        <div className="px-4 text-[14px] text-zinc-900 leading-relaxed mb-1">
          <span className="font-bold mr-2 cursor-pointer hover:text-zinc-600 transition-colors">{post.user.username}</span>
          {post.caption}
        </div>
      )}

      {/* Comments Toggle */}
      {commentCount > 0 && (
        <div className="px-4 mt-1">
          <button
            onClick={handleToggleComments}
            className="text-[14px] text-zinc-500 hover:text-zinc-700 transition-colors"
          >
            {showComments ? 'Hide comments' : 'View comments'}
          </button>
        </div>
      )}

      {/* Comments List */}
      {showComments && (
        <div className="px-4 mt-2 space-y-1">
          {isCommentsLoading ? (
            <div className="text-[14px] text-zinc-500">Loading comments...</div>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="text-[14px] text-zinc-900 leading-relaxed">
                <span className="font-bold mr-2 cursor-pointer hover:text-zinc-600 transition-colors">
                  {comment.user.username}
                </span>
                {comment.content}
              </div>
            ))
          )}
        </div>
      )}

      {/* Add comment input */}
      <form onSubmit={handlePostComment} className="px-4 mt-3 flex items-center border-t border-gray-50 pt-3">
        <input
          type="text"
          placeholder="Add a comment..."
          className="w-full text-sm outline-none bg-transparent"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className="text-sm font-bold text-black disabled:opacity-50 transition-opacity"
          disabled={!commentText.trim() || isSubmitting}
        >
          {isSubmitting ? 'Posting...' : 'Post'}
        </button>
      </form>
    </article>
  );
}
