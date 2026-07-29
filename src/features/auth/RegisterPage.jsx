import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './useAuth';
import { UserPlus } from 'lucide-react';
import clsx from 'clsx';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  });
  const { handleRegister, isLoading, errors } = useAuth();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleRegister(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-black mb-2">InstaApp</h1>
          <p className="text-gray-500">Sign up to see photos and videos from your friends.</p>
        </div>

        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
            {errors.general[0]}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1" htmlFor="login">
              Name
            </label>
            <input
              name="name"
              type="text"
              required
              className={clsx(
                "w-full px-3 py-2 border rounded-md outline-none transition-colors",
                errors.name ? "border-red-500 focus:border-red-600" : "border-gray-300 focus:border-black"
              )}
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1" htmlFor="login">
              Username
            </label>
            <input
              name="username"
              type="text"
              required
              className={clsx(
                "w-full px-3 py-2 border rounded-md outline-none transition-colors",
                errors.username ? "border-red-500 focus:border-red-600" : "border-gray-300 focus:border-black"
              )}
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1" htmlFor="login">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className={clsx(
                "w-full px-3 py-2 border rounded-md outline-none transition-colors",
                errors.email ? "border-red-500 focus:border-red-600" : "border-gray-300 focus:border-black"
              )}
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1" htmlFor="login">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className={clsx(
                "w-full px-3 py-2 border rounded-md outline-none transition-colors",
                errors.password ? "border-red-500 focus:border-red-600" : "border-gray-300 focus:border-black"
              )}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1" htmlFor="login">
              Confirm Password
            </label>
            <input
              name="passwordConfirmation"
              type="password"
              required
              className={clsx(
                "w-full px-3 py-2 border rounded-md outline-none transition-colors",
                errors.passwordConfirmation ? "border-red-500 focus:border-red-600" : "border-gray-300 focus:border-black"
              )}
              placeholder="Confirm Password"
              value={formData.passwordConfirmation}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.passwordConfirmation && (
              <p className="mt-1 text-xs text-red-500">{errors.passwordConfirmation[0]}</p>
            )}
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
                <UserPlus className="w-4 h-4" />
                Sign Up
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          Have an account?{' '}
          <Link to="/login" className="font-semibold text-black hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
