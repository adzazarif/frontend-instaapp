import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import clsx from 'clsx';

export default function PostCard({ post }) {
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
          <span className="text-zinc-400 text-xs font-medium px-1">• 2h</span>
        </div>
        <button className="text-zinc-800 p-1 hover:text-zinc-500 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Image */}
      <div className="w-full bg-zinc-50 aspect-square sm:aspect-[4/5] flex items-center justify-center overflow-hidden border-y border-gray-50">
        {post.images && post.images.length > 0 ? (
          <img src={post.images[0]} className="w-full h-full object-cover" alt="Post" />
        ) : (
          <div className="text-zinc-400 text-sm font-medium">No Image</div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <button className="hover:opacity-50 transition-opacity">
            <Heart className={clsx('w-[26px] h-[26px]', post.isLikedByMe ? 'fill-red-500 text-red-500' : 'text-zinc-900')} />
          </button>
          <button className="hover:opacity-50 transition-opacity">
            <MessageCircle className="w-[26px] h-[26px] text-zinc-900 -scale-x-100" />
          </button>
          <button className="hover:opacity-50 transition-opacity">
            <Send className="w-[26px] h-[26px] text-zinc-900" />
          </button>
        </div>
        <button className="hover:opacity-50 transition-opacity">
          <Bookmark className="w-[26px] h-[26px] text-zinc-900" />
        </button>
      </div>

      {/* Likes */}
      <div className="px-4 text-[14px] font-bold text-black mb-1.5 cursor-pointer">
        {post.likeCount.toLocaleString()} likes
      </div>

      {/* Caption */}
      {post.caption && (
        <div className="px-4 text-[14px] text-zinc-900 leading-relaxed">
          <span className="font-bold mr-2 cursor-pointer hover:text-zinc-600 transition-colors">{post.user.username}</span>
          {post.caption}
        </div>
      )}

      {/* Comments */}
      {post.commentCount > 0 && (
        <div className="px-4 mt-2">
          <button className="text-[14px] text-zinc-500 hover:text-zinc-700 transition-colors">
            View all {post.commentCount} comments
          </button>
        </div>
      )}
      
      {/* Add comment input (fake) */}
      <div className="px-4 mt-3 flex items-center border-t border-gray-50 pt-3 opacity-60">
        <input 
          type="text" 
          placeholder="Add a comment..." 
          className="w-full text-sm outline-none bg-transparent"
          disabled
        />
        <button className="text-sm font-bold text-black disabled:opacity-50" disabled>Post</button>
      </div>
    </article>
  );
}
