import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './useAuth';
import { LogIn } from 'lucide-react';
import clsx from 'clsx';

export default function LoginPage() {
  const [formData, setFormData] = useState({ login: '', password: '' });
  const { handleLogin, isLoading, errors } = useAuth();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleLogin(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-black mb-2">InstaApp</h1>
          <p className="text-gray-500">Sign in to see photos and videos from your friends.</p>
        </div>

        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
            {errors.general[0]}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1" htmlFor="login">
              Email or Username
            </label>
            <input
              id="login"
              name="login"
              type="text"
              required
              className={clsx(
                "w-full px-3 py-2 border rounded-md outline-none transition-colors",
                errors.login ? "border-red-500 focus:border-red-600" : "border-gray-300 focus:border-black"
              )}
              placeholder="Enter email or username"
              value={formData.login}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.login && <p className="mt-1 text-xs text-red-500">{errors.login[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className={clsx(
                "w-full px-3 py-2 border rounded-md outline-none transition-colors",
                errors.password ? "border-red-500 focus:border-red-600" : "border-gray-300 focus:border-black"
              )}
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password[0]}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-2 px-4 rounded-md font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-black hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
