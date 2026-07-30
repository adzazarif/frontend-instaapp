import axiosClient from './axiosClient';

export const searchUsers = (q) => axiosClient.get(`/user/search/${q}`);
