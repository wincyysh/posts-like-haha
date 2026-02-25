import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Schema } from 'mongoose';
import { S3Client  } from '@aws-sdk/client-s3';

dotenv.config();
const app = express();


// https://expressjs.com/en/resources/middleware/cors.html
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected');
        console.log('Database:', mongoose.connection.name);
    }catch(error){
        console.error('MongoDB connection failed: ',error.message);
    }
} 

connectDB();

// Defining your schema
// https://mongoosejs.com/docs/guide.html#definition
// String is shorthand for {type: String}
const postSchema = new Schema({ 
  content: { type: String, required: true },
  author: {
    id: String,
    name: String
  },
  interaction: {
    like: { type: Number, default: 0 },
    haha: { type: Number, default: 0 }
  },
  date: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);

const s3Client = new S3Client({});

// s3Client();

app.get('/',(req,res)=>{
    res.json({
        status: 'Sucsess',
        name: 'News Feed Web APP',
        timestamp: new Date().toISOString()
    });
});

app.get('/posts', async (req, res)=>{
    try{
        const post = await Post.find({});
        console.log('All posts find on MongoDB: ',post);
        res.json(post);
    }catch(error){
        console.error('Failed to fetch MongoDB posts: ', error.message);
        res.status(500).json({ message: "Server error" });
    }
});



const PORT = process.env.PORT || 3000
app.listen(PORT, function(){
    console.log(`Web Server is on PORT ${PORT}`)
})
