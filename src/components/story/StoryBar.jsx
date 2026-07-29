import clsx from 'clsx';

const DUMMY_STORIES = [
  { userId: 1, username: 'your_story', avatar: null, hasUnviewed: false, isUser: true },
  { userId: 2, username: 'johndoe', avatar: null, hasUnviewed: true },
  { userId: 3, username: 'janedoe', avatar: null, hasUnviewed: true },
  { userId: 4, username: 'mike_smith', avatar: null, hasUnviewed: true },
  { userId: 5, username: 'sara_w', avatar: null, hasUnviewed: false },
  { userId: 6, username: 'alexander', avatar: null, hasUnviewed: false },
];

export default function StoryBar() {
  return (
    <div className="flex gap-4 px-4 py-6 overflow-x-auto border-b border-gray-100 bg-white no-scrollbar">
      {DUMMY_STORIES.map((story) => (
        <button key={story.userId} className="group flex flex-col items-center gap-2 shrink-0 w-16">
          <div
            className={clsx(
              'w-[68px] h-[68px] rounded-full p-[2px] flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 cursor-pointer',
              story.hasUnviewed ? 'bg-black' : 'bg-zinc-200'
            )}
          >
            <div className="w-full h-full rounded-full border-[3px] border-white bg-zinc-100 overflow-hidden flex items-center justify-center relative">
              {story.avatar ? (
                <img src={story.avatar} className="w-full h-full object-cover" alt={story.username} />
              ) : (
                <div className="w-full h-full bg-zinc-100"></div>
              )}
              {story.isUser && !story.hasUnviewed && (
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-black rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold leading-none">+</span>
                </div>
              )}
            </div>
          </div>
          <span className="text-[12px] text-zinc-700 font-medium truncate w-full text-center">
            {story.isUser ? 'Your story' : story.username}
          </span>
        </button>
      ))}
    </div>
  );
}
