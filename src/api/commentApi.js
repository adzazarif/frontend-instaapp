import axiosClient from './axiosClient';

export const getComments = (postId, page = 1) => 
  axiosClient.get(`/posts/${postId}/comments`, { params: { page } });

export const addComment = (postId, content) => 
  axiosClient.post(`/posts/${postId}/comments`, { content });

export const deleteComment = (commentId) => 
  axiosClient.delete(`/comments/${commentId}`);
