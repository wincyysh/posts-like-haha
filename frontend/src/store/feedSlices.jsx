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

export const fetchPosts = createAsyncThunk(
    'feed/fetchPosts', async () => {
        const response = await postsAPI.fetchPosts();
        return response;
    }
);

export const createPosts = createAsyncThunk(
    'feed/createPosts', async (postData) => {
        const response = await postsAPI.createPosts(postData);
        return response;
    }
);

export const patchPosts = createAsyncThunk(
    'feed/patchPosts', async ({ postId, reactionType }) => postsAPI.patchPosts(postId, reactionType)
);

export const deletePosts = createAsyncThunk(
    'feed/deletePosts', async (postId) => {
        await postsAPI.deletePosts(postId);
        return postId;
    }
);

const feedSlice = createSlice({
    name: 'feed',
    initialState,
    reducers: {
        clearError: (state) => { state.error = null; }
    },
    extraReducers: (builder) => {
        builder
            // Test MongoDB Connection
            .addCase(testMongoDBConnection.pending, (state) => {
                state.connectionTests.mongodb = { status: 'testing' };
            })
            .addCase(testMongoDBConnection.fulfilled, (state, action) => {
                state.connectionTests.mongodb = { status: 'success', data: action.payload };
            })
            .addCase(testMongoDBConnection.rejected, (state, action) => {
                state.connectionTests.mongodb = { status: 'failed', error: action.error.message };
            })
            // Test AWS Connection
            .addCase(testAWSConnection.pending, (state) => {
                state.connectionTests.aws = { status: 'testing' };
            })
            .addCase(testAWSConnection.fulfilled, (state, action) => {
                state.connectionTests.aws = { status: 'success', data: action.payload };
            })
            .addCase(testAWSConnection.rejected, (state, action) => {
                state.connectionTests.aws = { status: 'failed', error: action.error.message };
            })
            // Fetch Posts
            .addCase(fetchPosts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'success';
                state.posts = action.payload.data;
                state.error = null;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // Create Posts
            .addCase(createPosts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createPosts.fulfilled, (state, action) => {
                state.status = 'success';
                state.posts.unshift(action.payload);
                state.error = null;
            })
            .addCase(createPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // Patch Posts
            .addCase(patchPosts.fulfilled, (state, action) => {
                // forgot to add updatedPost then won't updated patch automaticlly
                const updatedPost = action.payload.data;
                const index = state.posts.findIndex((post) => post._id === updatedPost._id);
                if (index !== -1) { state.posts[index] = updatedPost; }
            })
            // Delete Posts
            .addCase(deletePosts.fulfilled, (state, action) => {
                state.posts = state.posts.filter((post) => post._id !== action.payload);
            })
    }

});

export const { clearError } = feedSlice.actions;
export default feedSlice;