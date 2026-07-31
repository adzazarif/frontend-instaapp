import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, User, LogOut, PlusSquare } from 'lucide-react';
import clsx from 'clsx';
import { useAuthContext } from '../../context/AuthContext';
import { logoutUser } from '../../api/authApi';

export default function Sidebar() {
  const { pathname } = useLocation();
  const { logout, currentUser } = useAuthContext();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      logout();
    } catch (error) {
      console.error('Logout failed', error);
      logout();
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  const navItems = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Search', icon: Search, path: '/search' },
    { label: 'Create', icon: PlusSquare, path: '/create' },
    { label: 'Profile', icon: User, path: `/profile/${currentUser?.username || ''}` },
  ];

  return (
    <>
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
            onClick={() => setShowLogoutModal(true)}
            className="group flex items-center justify-center md:justify-start gap-4 p-2 md:p-3 rounded-lg transition-all duration-200 hover:bg-red-50 text-zinc-800 hover:text-red-600 md:mt-auto w-full"
            title="Logout"
          >
            <LogOut className="w-6 h-6 stroke-2 transition-transform duration-200 group-hover:scale-110" />
            <span className="hidden md:block text-[16px] font-medium">Logout</span>
          </button>
        </nav>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col">
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold text-black mb-2">Log Out?</h3>
              <p className="text-sm text-zinc-500">
                Are you sure you want to log out of your account?
              </p>
            </div>

            <div className="flex flex-col border-t border-gray-100">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="py-3.5 text-red-500 font-bold hover:bg-zinc-50 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isLoggingOut ? (
                  <span className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  'Log Out'
                )}
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                disabled={isLoggingOut}
                className="py-3.5 text-black hover:bg-zinc-50 border-t border-gray-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
