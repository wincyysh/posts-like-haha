// frontend/src/store/feedSlices.jsx
import React from "react";
import { configureStore, createSlice } from '@reduxjs/toolkit';

const feedSlice = createSlice({
    name: 'feed',
    initialState: { posts: [], },
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