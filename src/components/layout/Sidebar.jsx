import { Link, useLocation } from 'react-router-dom';
import { Home, Search, User, LogOut, PlusSquare } from 'lucide-react';
import clsx from 'clsx';
import { useAuthContext } from '../../context/AuthContext';
import { logoutUser } from '../../api/authApi';

export default function Sidebar() {
  const { pathname } = useLocation();
  const { logout, currentUser } = useAuthContext();

  const handleLogout = async () => {
    try {
      await logoutUser();
      logout();
    } catch (error) {
      console.error('Logout failed', error);
      logout();
    }
  };

  const navItems = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Search', icon: Search, path: '/search' },
    { label: 'Create', icon: PlusSquare, path: '/create' },
    { label: 'Profile', icon: User, path: `/profile/${currentUser?.username || ''}` },
  ];

  return (
    <aside className="fixed bottom-0 left-0 z-50 w-full bg-white/80 backdrop-blur-md border-t border-gray-200 h-14 md:sticky md:top-0 md:h-screen md:w-[250px] md:border-t-0 md:border-l md:border-r md:flex md:flex-col md:px-5 md:py-8 shrink-0 md:bg-white">
      {/* Logo - hidden on mobile */}
      <div className="hidden md:block mb-10 px-3">
        <Link to="/" className="text-2xl font-extrabold tracking-tighter text-black hover:opacity-80 transition-opacity">
          InstaApp
        </Link>
      </div>

      <nav className="flex flex-row justify-around h-full items-center md:flex-col md:justify-start md:items-stretch md:space-y-3 md:flex-1 w-full">
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
          return (
            <Link
              key={item.label}
              to={item.path}
              className={clsx(
                'group flex items-center justify-center md:justify-start gap-4 p-2 md:p-3 rounded-lg transition-all duration-200 w-full hover:bg-zinc-100',
                isActive ? 'font-bold text-black' : 'text-zinc-800'
              )}
            >
              <item.icon className={clsx(
                'w-6 h-6 transition-transform duration-200 group-hover:scale-110',
                isActive ? 'stroke-[2.5]' : 'stroke-2'
              )} />
              <span className="hidden md:block text-[16px]">{item.label}</span>
            </Link>
          );
        })}

        <button
          onClick={handleLogout}
          className="group flex items-center justify-center md:justify-start gap-4 p-2 md:p-3 rounded-lg transition-all duration-200 hover:bg-red-50 text-zinc-800 hover:text-red-600 md:mt-auto w-full"
          title="Logout"
        >
          <LogOut className="w-6 h-6 stroke-2 transition-transform duration-200 group-hover:scale-110" />
          <span className="hidden md:block text-[16px] font-medium">Logout</span>
        </button>
      </nav>
    </aside>
  );
}
