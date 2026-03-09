// frontend/src/components/FeedPost.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, patchPosts, deletePosts } from './../store/feedSlices';
import './FeedPost.css';
// ========================================
// FeedPost()
// ========================================
const FeedPost = () => {

    const dispatch = useDispatch();
    const { posts, status, error } = useSelector((state) => { state.feed });

    useEffect( () => { dispatch(fetchPosts()); }, [dispatch]);
    
    const handleReaction = (postId, reactionType) => {
        dispatch(patchPosts({postId, reactionType}));
    };
    
    const handleDelete = (postId) => {
        if(window.confirm('Are you sure to delete the post?')){
            dispatch(deletePosts(postId));
        }
    };

    
};

export default FeedPost;