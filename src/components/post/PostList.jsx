import PostCard from './PostCard';

const DUMMY_POSTS = [
  {
    id: 1,
    caption: 'Enjoying the nice weather today! ☀️',
    images: ['https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    likeCount: 124,
    commentCount: 12,
    isLikedByMe: false,
    user: { id: 2, username: 'johndoe', avatar: null },
    createdAt: '2026-07-29T10:00:00+00:00',
    location: 'Bali, Indonesia'
  },
  {
    id: 2,
    caption: 'Minimalist workspace setup. What do you think? 💻☕️',
    images: ['https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    likeCount: 89,
    commentCount: 5,
    isLikedByMe: true,
    user: { id: 3, username: 'janedoe', avatar: null },
    createdAt: '2026-07-29T11:00:00+00:00',
  },
  {
    id: 3,
    caption: 'City lights 🌃',
    images: ['https://images.unsplash.com/photo-1514565131-fce0801e5785?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    likeCount: 562,
    commentCount: 43,
    isLikedByMe: false,
    user: { id: 4, username: 'mike_smith', avatar: null },
    createdAt: '2026-07-29T12:00:00+00:00',
    location: 'Tokyo, Japan'
  },
];

export default function PostList() {
  return (
    <div className="flex flex-col w-full max-w-[600px] mx-auto pb-10">
      {DUMMY_POSTS.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
