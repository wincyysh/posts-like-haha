import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
// ========================================
// Create axios 
// ========================================
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

// ========================================
// MongoDB connection Test
// ========================================
export const testMongoDBConnection = async () => {
    try {
        const response = await api.get('/test-db');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'MongoDB Connection Failed');
    }
};

// ========================================
// AWS S3 connection Test
// ========================================
export const testAWSConnection = async () => {
    try {
        const response = await api.get('/test-aws');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'AWS S3 Connection Failed');
    }
};

// ========================================
// Fetch Posts
// ========================================
export const fetchPosts = async () => {
    try {
        const response = await api.get('/posts');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Fetch All Posts Failed');
    }
};

// ========================================
// Create a New Post
// ========================================
export const createPost = async (postData) => {
    try {
        // Use FormData to ensure the Server/Multer can read the fields
        const formData = new FormData();
        formData.append("content", postData.content);
        formData.append("authorName", postData.authorName || 'Anonymous');
        formData.append("authorId", postData.authorId || '000');
        // Only append if there's actually a image
        if (postData.image) {
            formData.append("image", postData.image);
        }
        const response = await api.post('/posts', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Create a New Post Failed');
    }
};

// ========================================
// Patch a Existing Post
// ========================================
export const patchPost = async () => {
    try {

    } catch (error) {
        throw new Error(error.response?.data?.message || 'Patch a Existing Post Failed');
    }
};