import axiosClient from './axiosClient';

export const getFeed = (page = 1) => axiosClient.get('/posts', { params: { page } });

export const getMyPosts = (page = 1) => axiosClient.get('/posts/my', { params: { page } });

export const getArchivedPosts = (page = 1) => axiosClient.get('/posts/archived', { params: { page } });

export const getPost = (postId) => axiosClient.get(`/posts/${postId}`);

export const createPost = (formData) => 
  axiosClient.post('/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updatePost = (postId, data) => axiosClient.put(`/posts/${postId}`, data);

export const deletePost = (postId) => axiosClient.delete(`/posts/${postId}`);

export const archivePost = (postId) => axiosClient.put(`/posts/${postId}/archive`);
