// frontend/src/store/feedSlices.jsx
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as postsAPI from '../api/posts'

const initialState = {
    posts: [],
    // 'idle' | 'loading' | 'succeeded' | 'failed'
    status: 'idle',
    error: null,
    connectionTests: {
        mongodb: null,
        aws: null
    }
};

export const testMongoDBConnection = createAsyncThunk(
    'feed/testMongoDBConnection', async () => {
        const response = await postsAPI.testMongoDBConnection();
        return response;
    }
);

export const testAWSConnection = createAsyncThunk(
    'feed/testAWSConnection', async () => {
        const response = await postsAPI.testAWSConnection();
        return response;
    }
);

const feedSlice = createSlice({
    name: 'feed',
    initialState,
    reducers: {
        addPost: (state, action) => {
            state.posts.unshift(action.payload);
        },
        fetchPosts: (state, action) => {
            state.posts.unshift(action.payload);
        },
        patchPosts: (state, action) => {
            state.posts.unshift(action.payload);
        },
        deletePosts: (state, action) => {
            state.posts.unshift(action.payload);
        }
    },
});

export const { addPost, setPost } = feedSlice.actions;
export default feedSlice;