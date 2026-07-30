import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { searchUsers } from '../../api/userApi';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const debouncedQuery = useDebounce(query, 500);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        setHasSearched(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await searchUsers(debouncedQuery);
        setResults(response.data || []);
        setHasSearched(true);
      } catch (err) {
        setError('Failed to fetch search results.');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [debouncedQuery]);

  return (
    <MainLayout>
      <div className="flex flex-col w-full max-w-[700px] mx-auto min-h-screen bg-white">

        {/* Search Header */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-sm z-20 border-b border-gray-100 p-4">
          <h1 className="text-2xl font-bold text-black mb-4">Search</h1>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users..."
              className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-zinc-100 text-black placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-zinc-300 sm:text-sm transition-shadow"
            />
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto">
          {isLoading && (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
            </div>
          )}

          {error && (
            <div className="p-4 text-center text-sm text-red-500">
              {error}
            </div>
          )}

          {!isLoading && !error && hasSearched && results.length === 0 && (
            <div className="p-8 text-center text-zinc-500 text-sm">
              No results found for "{debouncedQuery}".
            </div>
          )}

          {!isLoading && !error && results.length > 0 && (
            <div className="flex flex-col">
              {results.map((user) => (
                <div
                  key={user.id}
                  onClick={() => navigate(`/profile/${user.username}`)}
                  className="flex items-center px-4 py-3 hover:bg-zinc-50 cursor-pointer transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-zinc-200 overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center mr-3">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-zinc-400 text-lg uppercase font-semibold">{user.username[0]}</span>
                    )}
                  </div>

                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-[14px] font-semibold text-black truncate">{user.username}</span>
                    <span className="text-[14px] text-zinc-500 truncate">{user.name}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!hasSearched && !isLoading && (
            <div className="p-8 text-center text-zinc-400 text-sm flex flex-col items-center">
              <SearchIcon className="w-12 h-12 mb-3 text-zinc-200" />
              <p>Search for friends and creators.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
