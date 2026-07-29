import { useState, useEffect, useCallback } from 'react';
import { getPost } from '../api/postApi';

export function usePostDetail(postId) {
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPost = useCallback(async () => {
    if (!postId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await getPost(postId);
      setPost(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load post.');
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  return { post, isLoading, error, refetch: fetchPost };
}
