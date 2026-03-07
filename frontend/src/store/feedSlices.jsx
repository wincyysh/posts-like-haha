// frontend/src/store/feedSlices.jsx
import React from "react";
import { configureStore, createSlice } from '@reduxjs/toolkit';

const initialState = {
    posts: [],
    // 'idle' | 'loading' | 'succeeded' | 'failed'
    status: 'idle',
    error: null
}

const feedSlice = createSlice({
    name: 'feed',
    initialState,
    reducers: {
        addPost: (state, action) => {
            state.posts.unshift(action.payload);
        },
        setPost: (state, action) => {
            state.posts = action.payload;
        }
    },
});

export const { addPost, setPost } = feedSlice.actions;
export default feedSlice;