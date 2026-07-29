import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

export default function PublicRoute({ children }) {
  const { currentUser, isInitializing } = useAuthContext();

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <span className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return children;
}
