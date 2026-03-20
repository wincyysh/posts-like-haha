// frontend/src/components/FeedPost.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, patchPosts, deletePosts } from '../store/feedSlices';
import { getImageUrl } from "../api/posts";
import './FeedPost.css';
// ========================================
// formatDate = (dateString) => {}
// ========================================
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just Now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
};

// ========================================
// LoadingView = () => ()
// ========================================
const LoadingView = () => (
    <div className="loading-container">
        <h3>Loading posts ... </h3>
    </div>
);

// ========================================
// FailedView = () => ()
// ========================================
const FailedView = ({ error, onRetry }) => (
    <div className="error-container">
        <h3> Error Loading posts </h3>
        <p>{error}</p>
        <button
            onClick={onRetry}
            className="retry-buttom"
        >
            retry
        </button>
    </div >
);

// ========================================
// EmptyView () => ()
// ========================================
const EmptyView = () => (
    <div className="empty-container">
        <h3> No Posts Yet </h3>
        <p>Be the first to create a post</p>
    </div>
);

// ========================================
// PostImage = ({ url }) => {}
// ========================================
const PostImage = ({ imageKey }) => {
    const [url, setUrl] = useState(null);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        if (!imageKey) return;
        getImageUrl(imageKey)
            .then(setUrl)
            .catch(() => setFailed(true));
    }, [imageKey]);

    if (failed) return <p> Image Failed To Load </p>;
    if (!url) return <div className="post-image-container" style={{ height: 80, background: '#f5f5f3' }} />;

    return (
        <div className="post-image-container">
            <img
                src={url}
                alt="Post Content"
                className="post-image"
                onError={() => setFailed(true)}
            />
        </div>
    );
};

// ========================================
// PostReactions = ({}) => ()
// ========================================
const PostReactions = ({ reactions }) => (
    <div className="reactions-container">
        {reactions?.likes > 0 && <span className="reaction-count"> 👍 {reactions.likes} </span>}
        {reactions?.hahas > 0 && <span className="reaction-count"> 😂 {reactions.hahas} </span>}
    </div>
);

// ========================================
// PostCard = ({ post, onDelete, onReaction }) => {}
// ========================================
const PostCard = ({ post, onDelete, onReaction }) => {
    const authorInitial = post.author?.name?.charAt(0).toUpperCase() ?? 'Anonymous';
    const authorName = post.author?.name ?? 'Anonymous';

    return (
        <div className="post-card">
            <div className="post-body">
                <div className="post-header">
                    <div className="author-info">
                        <div className="author-avatar">{authorInitial}</div>
                        <div className="author-detail">
                            <div className="author-name">{authorName}</div>
                            <div className="post-timestamp">{formatDate(post.date)}</div>
                        </div>
                    </div>
                    <button
                        onClick={() => onDelete(post._id)}
                        className="delete-button"
                        title="delete"
                    >
                        delete
                    </button>
                </div>
                <div className="post-content"> {post.content} </div>
                {post.imageKey && <PostImage imageKey={post.imageKey} />}
                <PostReactions reactions={post.reactions} />
                <div className="actions-container">
                    <button onClick={() => onReaction(post._id, 'likes')} className="action-button"> 👍 Like </button>
                    <button onClick={() => onReaction(post._id, 'hahas')} className="action-button"> 😂 haha </button>
                </div>
            </div>
        </div>
    );
};

// ========================================
// FeedPost()
// ========================================    
const FeedPost = () => {

    const dispatch = useDispatch();
    const { posts, status, error } = useSelector((state) => state.feed);

    useEffect(() => { dispatch(fetchPosts()); }, [dispatch]);

    const handleReaction = (postId, reactionType) => {
        dispatch(patchPosts({ postId, reactionType }));
    };

    const handleDelete = (postId) => {
        if (window.confirm('Are you sure to delete the post?')) {
            dispatch(deletePosts(postId));
        }
    };

    if (status === 'loading' && posts.length === 0) return <LoadingView />;
    if (status === 'failed') return <FailedView error={error} onRetry={() => dispatch(fetchPosts())} />;
    if (posts.length === 0) return <EmptyView />;

    return (
        <div className="feed-post-container">
            <h3 className="feed-title"> Feed ({posts.length} posts) </h3>
            {posts.map((post) => (
                <PostCard
                    key={post._id}
                    post={post}
                    onDelete={handleDelete}
                    onReaction={handleReaction}
                />
            ))}
        </div>
    );
};

export default FeedPost;