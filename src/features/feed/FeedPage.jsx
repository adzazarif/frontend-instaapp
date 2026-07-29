import { useAuthContext } from '../../context/AuthContext';
import { LogOut } from 'lucide-react';
import { logoutUser } from '../../api/authApi';

export default function FeedPage() {
  const { currentUser, logout } = useAuthContext();

  const handleLogout = async () => {
    try {
      await logoutUser();
      logout();
    } catch (error) {
      console.error('Logout failed', error);
      // Even if API fails, clear local state
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-black">Feed</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
        <p className="text-gray-700 mb-4">Welcome back, {currentUser?.name} (@{currentUser?.username})!</p>
        <p className="text-sm text-gray-500">This is a placeholder for the Feed page.</p>
      </div>
    </div>
  );
}
