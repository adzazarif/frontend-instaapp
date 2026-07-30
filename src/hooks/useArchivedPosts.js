import { useState, useEffect, useCallback } from 'react';
import { getArchivedPosts } from '../api/postApi';

export function useArchivedPosts() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalPosts, setTotalPosts] = useState(0);

  const fetchPosts = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getArchivedPosts(page);
      
      setPosts((prev) => {
        if (page === 1) return response.data;
        const newPosts = response.data.filter(
          (newP) => !prev.some((p) => p.id === newP.id)
        );
        return [...prev, ...newPosts];
      });
      
      setCurrentPage(response.meta.currentPage);
      setHasMore(response.meta.currentPage < response.meta.lastPage);
      setTotalPosts(response.meta.total);
    } catch (err) {
      setError(err.message ?? 'Failed to load posts.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  return { posts, currentPage, isLoading, error, hasMore, totalPosts, fetchPosts };
}
