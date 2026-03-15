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

    const formateDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = mathfloor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just Now';
        if (diffMins < 1) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`; 

        return date.toLocaleDateString();
    }

    if (status === 'loading' && posts.length === 0){
        return (
            <div className="loading-container">
                <h3>Loading posts ... </h3>
            </div>
        );
    }
    if (status === 'failed') {
        return (
            <div className="error-container">
                <h3> Error Loading posts </h3>
                <p>{error}</p>
                <button
                    onClick={() => dispatch(fetchPosts())}
                    className="retry-buttom"
                >
                    retry
                </button>
            </div>
        );
    }
    if (posts.length === 0) {
        return (
            <div className="empty-container">
                <h3> No Posts Yet </h3>
                <p>Be the first to create a post</p>
            </div>
        );
    }
    const PostCard = ({ post, onDelete }) => {
        const authorInitial = post.author?.name?.charAt(0).toUpperCase() ?? 'Anonymous';
        const authorName = post.author?.name ?? 'Anonymous';

        return (
            <div className="post-card">
                <div className="post-header">
                    <div className="author-info">
                        <div className="author-avatar">{authorInitial}</div>
                        <div className="author-detail">
                            <div className="author-name">{authorName}</div>
                            <div className="post-timestamp">{formateDate(post.createdAt)}</div>
                        </div>
                    </div>
                    
                </div>

            </div>
        );
    }
};

export default FeedPost;