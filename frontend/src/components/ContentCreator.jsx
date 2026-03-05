// frontend/src/components/ContentCreator.jsx
import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { addPost } from './../store/feedSlices';
import axios from "axios";
import "./ContentCreator.css";

const ContentCreator = () => {
    const dispatch = useDispatch();
    const [content, setContent] = useState('');
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

		const postData = {
			content,
			authorName: 'march 15',
			authorId: '123',
			image
		};

		try {
			const test = await dispatch(addPost(postData));
			console.log(test);
			// Clear form
			setContent('');
			setImage(null);
			setImagePreview(null);
		} catch (err) {
			alert('❌ Failed to create post: ' + err);
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
                    cols="33">
                </textarea>                   
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