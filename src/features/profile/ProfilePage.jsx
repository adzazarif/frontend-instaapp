import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { Settings, Grid, Bookmark, UserPlus, Heart, MessageCircle, Archive } from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { useMyPosts } from '../../hooks/useMyPosts';
import { useArchivedPosts } from '../../hooks/useArchivedPosts';

export default function ProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuthContext();
  const { posts, totalPosts, isLoading } = useMyPosts();
  const { posts: archivedPosts, isLoading: isArchivedLoading } = useArchivedPosts();
  
  const [activeTab, setActiveTab] = useState('posts');

  // If viewing own profile, use currentUser. If viewing someone else, 
  // ideally we fetch their data. For now, since we only have `/auth/me` and `/posts/my`,
  // we'll assume it's our own profile or display minimal data if it's someone else.
  const isOwnProfile = currentUser?.username === username;
  
  // Use current user if it's their profile. If not, use basic params.
  const user = isOwnProfile ? currentUser : {
    username: username,
    name: username,
    avatar: null,
    bio: 'No bio available.',
  };

  const followersCount = 1205; // Static dummy as requested
  const followingCount = 350;  // Static dummy as requested
  const postCount = isOwnProfile ? totalPosts : 0;

  return (
    <MainLayout>
      <div className="flex flex-col w-full max-w-[800px] mx-auto min-h-screen bg-white">
        
        {/* Header / User Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 px-6 py-8 md:px-12 md:py-10 border-b border-gray-100">
          {/* Avatar */}
          <div className="w-24 h-24 sm:w-36 sm:h-36 shrink-0 rounded-full bg-zinc-100 overflow-hidden border border-gray-200 self-center sm:self-start flex items-center justify-center">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
            ) : (
              <span className="text-zinc-400 text-4xl uppercase">{user?.username?.[0] || 'U'}</span>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex flex-col flex-1 w-full">
            {/* Username & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-4">
              <h1 className="text-xl sm:text-2xl font-semibold text-black">{user?.username}</h1>
              
              <div className="flex items-center gap-2">
                {isOwnProfile ? (
                  <>
                    <button className="px-4 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-black text-sm font-semibold rounded-lg transition-colors">
                      Edit Profile
                    </button>
                    <button className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors text-black">
                      <Settings className="w-6 h-6" />
                    </button>
                  </>
                ) : (
                  <>
                    <button className="px-5 py-1.5 bg-black hover:bg-zinc-800 text-white text-sm font-semibold rounded-lg transition-colors">
                      Follow
                    </button>
                    <button className="px-4 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-black text-sm font-semibold rounded-lg transition-colors">
                      Message
                    </button>
                    <button className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors text-black">
                      <UserPlus className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Stats (Desktop) */}
            <div className="hidden sm:flex items-center gap-8 mb-4">
              <div className="text-[16px] text-zinc-900"><span className="font-semibold text-black">{postCount}</span> posts</div>
              <div className="text-[16px] text-zinc-900 cursor-pointer"><span className="font-semibold text-black">{followersCount.toLocaleString()}</span> followers</div>
              <div className="text-[16px] text-zinc-900 cursor-pointer"><span className="font-semibold text-black">{followingCount.toLocaleString()}</span> following</div>
            </div>

            {/* Bio */}
            <div className="text-[14px] text-zinc-900">
              <div className="font-bold mb-1">{user?.name}</div>
              <div className="whitespace-pre-line leading-relaxed">{user?.bio || ''}</div>
            </div>
          </div>
        </div>

        {/* Stats (Mobile) */}
        <div className="flex sm:hidden items-center justify-around py-4 border-b border-gray-100 text-[14px]">
          <div className="flex flex-col items-center"><span className="font-semibold text-black">{postCount}</span> <span className="text-zinc-500 text-xs">posts</span></div>
          <div className="flex flex-col items-center cursor-pointer"><span className="font-semibold text-black">{followersCount.toLocaleString()}</span> <span className="text-zinc-500 text-xs">followers</span></div>
          <div className="flex flex-col items-center cursor-pointer"><span className="font-semibold text-black">{followingCount.toLocaleString()}</span> <span className="text-zinc-500 text-xs">following</span></div>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-center gap-12 sm:gap-16 border-t sm:border-t-0 border-gray-100">
          <button 
            onClick={() => setActiveTab('posts')}
            className={clsx(
              "flex items-center gap-2 py-4 border-t-2 text-[12px] font-semibold tracking-widest uppercase transition-colors",
              activeTab === 'posts' ? "border-black text-black" : "border-transparent text-zinc-400 hover:text-zinc-800"
            )}
          >
            <Grid className="w-4 h-4" />
            <span className="hidden sm:inline">Posts</span>
          </button>
          
          {isOwnProfile && (
            <button 
              onClick={() => setActiveTab('archived')}
              className={clsx(
                "flex items-center gap-2 py-4 border-t-2 text-[12px] font-semibold tracking-widest uppercase transition-colors",
                activeTab === 'archived' ? "border-black text-black" : "border-transparent text-zinc-400 hover:text-zinc-800"
              )}
            >
              <Archive className="w-4 h-4" />
              <span className="hidden sm:inline">Archived</span>
            </button>
          )}
        </div>

        {/* Grid Content */}
        {activeTab === 'posts' && (
          <div className="pb-10">
            {isLoading && posts.length === 0 ? (
              <div className="flex justify-center py-20">
                <span className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></span>
              </div>
            ) : posts.length === 0 ? (
              <div className="flex justify-center py-20 text-gray-500">
                No posts yet.
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1 sm:gap-2">
                {posts.map((post) => (
                  <div 
                    key={post.id} 
                    onClick={() => navigate(`/post/${post.id}`)}
                    className="aspect-square bg-zinc-100 overflow-hidden relative group cursor-pointer"
                  >
                    {post.images && post.images.length > 0 ? (
                      <img src={post.images[0]} alt="post" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs">No Image</div>
                    )}
                    
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold">
                      <div className="flex items-center gap-1.5"><Heart className="w-5 h-5 fill-white" /> {post.likeCount}</div>
                      <div className="flex items-center gap-1.5"><MessageCircle className="w-5 h-5 fill-white" /> {post.commentCount}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'archived' && (
          <div className="pb-10">
            {isArchivedLoading && archivedPosts.length === 0 ? (
              <div className="flex justify-center py-20">
                <span className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></span>
              </div>
            ) : archivedPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <div className="w-16 h-16 rounded-full border-2 border-black flex items-center justify-center mb-4">
                  <Archive className="w-8 h-8 text-black" />
                </div>
                <h2 className="text-2xl font-bold text-black mb-2">No Archived Posts</h2>
                <p className="text-sm text-zinc-500 max-w-sm">
                  Posts that you archive will appear here. Only you can see them.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1 sm:gap-2">
                {archivedPosts.map((post) => (
                  <div 
                    key={post.id} 
                    onClick={() => navigate(`/post/${post.id}`)}
                    className="aspect-square bg-zinc-100 overflow-hidden relative group cursor-pointer"
                  >
                    {post.images && post.images.length > 0 ? (
                      <img src={post.images[0]} alt="post" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs">No Image</div>
                    )}
                    
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold">
                      <div className="flex items-center gap-1.5"><Heart className="w-5 h-5 fill-white" /> {post.likeCount}</div>
                      <div className="flex items-center gap-1.5"><MessageCircle className="w-5 h-5 fill-white" /> {post.commentCount}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </MainLayout>
  );
}
