// frontend/src/components/ContentCreator.jsx
import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { addPost, setPost } from './../store/feedSlices';
import axios from "axios";
import "./ContentCreator.css";

const ContentCreator = () => {
    const dispatch = useDispatch();
    const [content, setContent] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [authorId, setAuthorId] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleImage = (e)=>{
        e.preventDefault();
        
        const file = e.target.files[0];
        if(file){
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
        if(authorId.trim()) { setAuthorId(authorId) };
        if(authorName.trim()) { setAuthorName(authorName) };

		try {

            // Use FormData to ensure the Server/Multer can read the fields
            const formData = new FormData();
            formData.append("content", content);
            formData.append("authorName", authorName || 'Anonymous');
            formData.append("authorId", authorId || '000');
            
            // Only append if there's actually a file
            if (image) {
                formData.append("image", image);
            }

            const response = await axios.post("http://localhost:3000/posts", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            console.log("Response from Server:", response.data);
            dispatch(addPost(response.data)); // Update the Client Store
			// Clear form
			setContent('');
			setImage(null);
			setImagePreview(null);
            setAuthorId('');
            setAuthorName('');
		} catch (error) {
			console.error(error.response);
		}
	};

    return (
        <div>
            <h3> Share your moment on a new Post </h3>
            <form
                onSubmit={handleSubmit}>
                <textarea 
                    value={content}
                    onChange={(e)=>setContent(e.target.value)}
                    placeholder="Tell us your story:"
                    id="story" 
                    name="story" 
                    rows="5" 
                    cols="50">
                </textarea>
                <input
                    value={authorName}
                    onChange={(e)=>{setAuthorName(e.target.value)}}
                    id="authorName"
                    size="50"
                    placeholder="authorName">
                </input>
                <input
                    value={authorId}
                    onChange={(e)=>{setAuthorId(e.target.value)}}
                    id="authorId"
                    size="50"
                    placeholder="authorId">
                </input>                   
                <label>
                    Choose image to upload
                    <input 
                        type="file"
                        onChange={handleImage}
                        id="upload-img" 
                        accept="image/*" 
                    />
                </label>
                {imagePreview && 
                    (<div>
                        <img src={imagePreview} />
                        <button
                            type="button"
                            onClick={()=>{setImage(null); setImagePreview(null);}}
                        >
                            Remove your image
                        </button>
                    </div>)
                }
                <button type="submit">submit</button>
            </form>
        </div>
    );
};

export default ContentCreator;