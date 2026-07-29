import { useState, useCallback } from 'react';
import { getComments, addComment, deleteComment } from '../api/commentApi';

export function useComments(postId, initialCommentCount = 0) {
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(initialCommentCount);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  
  const fetchComments = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await getComments(postId, page);
      setComments((prev) => {
        if (page === 1) return response.data;
        const newComments = response.data.filter(
          (newC) => !prev.some((c) => c.id === newC.id)
        );
        return [...prev, ...newComments];
      });
      setHasFetched(true);
    } catch (err) {
      setError(err.message ?? 'Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  const submitComment = async (content) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await addComment(postId, content);
      setComments((prev) => [response.data, ...prev]);
      setCommentCount((prev) => prev + 1);
      return true;
    } catch (err) {
      setError(err.message ?? 'Failed to add comment');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter(c => c.id !== commentId));
      setCommentCount((prev) => prev - 1);
    } catch (err) {
      console.error('Failed to delete comment', err);
    }
  };

  return { 
    comments, 
    commentCount, 
    isLoading, 
    isSubmitting, 
    error, 
    hasFetched,
    fetchComments, 
    submitComment,
    removeComment
  };
}
