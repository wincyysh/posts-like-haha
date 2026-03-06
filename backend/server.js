// /backend/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Schema } from 'mongoose';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import { feedSlice } from './../frontend/src/store/feedSlices'

// https://expressjs.com/en/resources/middleware/cors.html
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection configuration
const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected');
        console.log('Database:', mongoose.connection.name);
        console.log('connectionState: ', mongoose.connection.readyState);
    }catch(error){
        console.error('MongoDB connection failed: ',error.message);
    }
} 
// Actually call connection
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
  imageUrl: String,
  interaction: {
    like: { type: Number, default: 0 },
    haha: { type: Number, default: 0 }
  },
  date: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);

// test if web app is running
app.get('/',(req,res)=>{
    res.json({
        status: 'Sucsess',
        name: 'News Feed Web APP',
        timestamp: new Date().toISOString()
    });
});
const PORT = process.env.PORT || 3000
app.listen(PORT, function(){
    console.log(`Web Server is on PORT ${PORT}`)
});

// test connection of MongoDB
app.get('/posts', async (req, res)=>{
    try{
        const post = await Post.find({});
        res.json(post);
        console.log('All posts find on MongoDB: ',post);

    }catch(error){
        console.error('Failed to fetch MongoDB posts: ', error.message);
        res.status(500).json({ message: "Server error" });
    }
});

// AWS S3 image upload Configuration
// https://docs.aws.amazon.com/AmazonS3/latest/API/s3_example_s3_PutObject_section.html
const connectS3Client = new S3Client({
    region:  process.env.AWS_REGION || 'AWS_REGION',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'AWS_ACCESS_KEY_ID',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'AWS_SECRET_ACCESS_KEY'
    }
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/posts', upload.single('image'), async (req, res) => {
    try{
        let awsImageUrl = '';
        if (req.file){
            // unique imageName in s3, the buffer from multer;
            const imageName = `posts/${Date.now()}_${req.file.originalname}`; 
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME || 'AWS_BUCKET_NAME', 
                Key: imageName,
                // so that the s3 store file correct not mixup types
                Body: req.file.buffer, 
                ContentType: req.file.mimetype
            };
            const command = new PutObjectCommand(params);
            await connectS3Client.send(command);
            awsImageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageName}`;
        }
        // // DEBUG: if no image & no response
        // }else{
        //     return res.status(400).send('No image files uploaded!');
        // }

        const { content, authorName, authorId } = req.body;

        const newPost = new Post({
            content: content,
            author: {
                id: authorId,
                name: authorName
            },
            imageUrl: awsImageUrl,
            interaction: { likes: 0, haha: 0 }
        });

        const savedPost = await newPost.save();
        console.log("Post saved:", savedPost);
        // Send the saved post back to React
        res.status(201).json(savedPost);

    }catch(error){
        console.log(error.message);
        // Send error back to React
        res.status(500).json({ error: error.message }); 
    }

});

// check if uploaded seccussfully
// This route is now a "Fixed" path
// We get the key from the ?key= part of the URL
app.get("/get-image", async (req, res) => {
  const fileKey = req.query.key; 

// DEBUG: Check if variables are actually loading
//   console.log("Looking for S3 Key:", fileKey);
//   console.log("Region:", process.env.AWS_REGION);
//   console.log("Bucket:", process.env.AWS_BUCKET_NAME);
//   console.log("Key Exists?:", !!fileKey);
  if (!fileKey) {
    return res.status(400).json({ error: "Missing 'key' parameter" });
  }

  try {
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey,
    });

    const url = await getSignedUrl(connectS3Client, command, { expiresIn: 3600 });
    res.json({ url });
  } catch (err) {
    console.error("S3 Error:", err);
    res.status(500).json({ error: "Could not generate S3 URL" });
  }
});