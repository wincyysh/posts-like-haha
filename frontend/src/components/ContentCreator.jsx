import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { createPosts } from './../store/feedSlices';
import "./ContentCreator.css";

const ContentCreator = () => {
    const dispatch = useDispatch();
    const [content, setContent] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [authorId, setAuthorId] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) {
            alert('Please enter some content');
            return;
        }
        try {
            await dispatch(createPosts({ content, authorName, authorId, image }));
            setContent('');
            setImage(null);
            setImagePreview(null);
            setAuthorId('');
            setAuthorName('');
        } catch (error) {
            console.error(error);
        }
    };

    const authorInitial = authorName?.charAt(0).toUpperCase() || 'A';

    return (
        <div className="content-creator">
            <div className="creator-top">
                <div className="creator-avatar">{authorInitial}</div>
                <div className="creator-fields">
                    <textarea
                        className="creator-textarea"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Share your moment..."
                        rows="3"
                    />
                    <input
                        className="creator-input"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        placeholder="Your name"
                    />
                    <input
                        className="creator-input"
                        value={authorId}
                        onChange={(e) => setAuthorId(e.target.value)}
                        placeholder="Your ID"
                    />
                </div>
            </div>

            {imagePreview && (
                <div className="creator-preview">
                    <img src={imagePreview} alt="Preview" />
                    <button
                        type="button"
                        className="creator-remove-img"
                        onClick={() => { setImage(null); setImagePreview(null); }}
                    >
                        Remove
                    </button>
                </div>
            )}

            <div className="creator-divider" />

            <div className="creator-actions">
                <label className="creator-image-btn">
                    + Add image
                    <input
                        type="file"
                        onChange={handleImage}
                        accept="image/*"
                        style={{ display: 'none' }}
                    />
                </label>
                <button
                    type="button"
                    className="creator-submit"
                    onClick={handleSubmit}
                >
                    Post
                </button>
            </div>
        </div>
    );
};

export default ContentCreator;