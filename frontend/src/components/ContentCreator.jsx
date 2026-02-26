import React, { useState } from "react";
import "./ContentCreator.css";

const ContentCreator = () => {
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleImage = (e)=>{
        const file = e.target.files[0];
        if(file){
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = ()=>{

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
                            type="buttom"
                            onClick={()=>{setImage(null); setImagePreview(null);}}
                        >
                            Remove your image
                        </button>
                    </div>)
                }
            </form>
        </div>
    );
};

export default ContentCreator;