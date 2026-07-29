import axiosClient from './axiosClient';

export const toggleLikePost = (postId) => axiosClient.post(`/posts/${postId}/like`);

export const getLikers = (postId, page = 1) => axiosClient.get(`/posts/${postId}/likes`, { params: { page } });
