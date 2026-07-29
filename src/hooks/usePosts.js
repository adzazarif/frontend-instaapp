import { useState, useEffect, useCallback } from 'react';
import { getFeed } from '../api/postApi';

export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchFeed = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getFeed(page);
      
      setPosts((prev) => {
        if (page === 1) return response.data;
        // prevent duplicates if any
        const newPosts = response.data.filter(
          (newP) => !prev.some((p) => p.id === newP.id)
        );
        return [...prev, ...newPosts];
      });
      
      setCurrentPage(response.meta.currentPage);
      setHasMore(response.meta.currentPage < response.meta.lastPage);
    } catch (err) {
      setError(err.message ?? 'Failed to load feed.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed(1);
  }, [fetchFeed]);

  return { posts, currentPage, isLoading, error, hasMore, fetchFeed };
}
