// /backend/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Schema } from 'mongoose';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// ========================================
// Body parsing middleware
// CRITICAL: CORS MUST BE CONFIGURED FIRST!
// https://expressjs.com/en/resources/middleware/cors.html
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS
// ========================================
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========================================
// MongoDB Configuration
// ========================================
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected');
        console.log('Database:', mongoose.connection.name);
    } catch (error) {
        console.error('MongoDB connection failed: ', error.message);
    }
}

// ========================================
// Defining MongoDB Data schema
// https://mongoosejs.com/docs/guide.html#definition
// String is shorthand for {type: String}
// ========================================
const postSchema = new Schema({
    content: { type: String, required: true },
    author: {
        id: String,
        name: String
    },
    imageKey: String,
    reactions: {
        likes: { type: Number, default: 0 },
        hahas: { type: Number, default: 0 }
    },
    date: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);


// ========================================
// AWS S3  Configuration (image upload)
// https://docs.aws.amazon.com/AmazonS3/latest/API/s3_example_s3_PutObject_section.html
// ========================================
const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'AWS_REGION',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'AWS_ACCESS_KEY_ID',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'AWS_SECRET_ACCESS_KEY'
    }
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ========================================
// test if web app SERVER is running
// ========================================
app.get('/', (req, res) => {
    res.json({
        status: 'Sucsess',
        name: 'News Feed Web APP',
        timestamp: new Date().toISOString()
    });
});

// ========================================
// test connection of MongoDB
// ========================================
app.get('/api/test-db', async (req, res) => {
    try {
        const dbState = mongoose.connection.readyState;
        const states = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting',
        }
        res.json({
            status: 'success',
            message: 'Database Connection Test',
            connectionState: states[dbState],
            isConnected: dbState === 1
        });
    } catch (error) {
        console.error('Failed to fetch MongoDB posts: ', error.message);
        res.status(500).json({ message: "Server error" });
    }
});

// ========================================
// test connection of AWS S3
// ========================================
app.get('/api/test-aws', async (req, res) => {
    try {
        const testAWSParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: 'test-connection.txt',
            Body: 'AWS Connection Test'
        };
        const command = new PutObjectCommand(testAWSParams);
        await s3Client.send(command);
        res.json({
            status: 'success',
            message: 'AWS S3 connection successful'
        });
    } catch (error) {
        console.error('Test AWS S3 connection fail: /api/test-aws', error.message);
    }
});

// ========================================
// Fetch Posts From MongoDB
// ========================================
app.get('/api/posts', async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        res.json({
            status: 'success',
            count: posts.length,
            data: posts
        });
    } catch (error) {
        console.error('Failed to fetch posts from MongoDB : ', error.message);
        res.status(500).json({ message: "Server error" });
    }
});


// ========================================
// CREATE A NEW POST 
// upload to both MongoDB & AWS S3
// ========================================
app.post('/api/posts', upload.single('image'), async (req, res) => {
    try {
        let awsImageUrl = '';
        if (req.file) {
            // unique imageName in s3, the buffer from multer;
            const imageName = `posts/${Date.now()}_${req.file.originalname}`;
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: imageName,
                // so that the s3 store file correct not mixup types
                Body: req.file.buffer,
                ContentType: req.file.mimetype
            };
            const command = new PutObjectCommand(params);
            await s3Client.send(command);
            // awsImageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageName}`;
            awsImageUrl = imageName;
        }

        const { content, authorName, authorId } = req.body;
        const newPost = new Post({
            content: content,
            author: { id: authorId, name: authorName },
            imageKey: awsImageUrl,
            interaction: { likes: 0, haha: 0 }
        });
        const savedPost = await newPost.save();
        // Send the saved post back to React
        res.status(201).json(savedPost);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }

});

app.get('/api/image-url', async (req, res) => {
    try {
        const { key } = req.query;
        if (!key) return res.status(400).json({ message: 'Missing Key' });

        const command = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
        });
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        res.json({ url });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ========================================
// Patch A existing POST 
// upload to both MongoDB & AWS S3
// ========================================
app.patch('/api/posts/:id/react', async (req, res) => {
    try {
        const { reactionType } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                status: 'error',
                message: 'Post not found'
            });
        }

        post.reactions[reactionType] += 1;
        await post.save();

        res.json({
            status: 'success',
            data: post
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

app.delete('/api/posts/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({
                status: 'error',
                message: 'Post not found'
            });
        }
        if (post.imageKey) {
            const command = new DeleteObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: post.imageKey,
            });
            await s3Client.send(command);
        }
        await post.deleteOne();
        res.json({
            status: 'success',
            message: 'Post deleted successfully'
        });
    } catch (error) {
        console.error('DELETE /api/posts/:id error:', error.message);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// ========================================
// Actually START SERVER
// ========================================
const startServer = async () => {
    await connectDB();
    const PORT = process.env.PORT
    app.listen(PORT, () => {
        console.log(`Web Server is on PORT ${PORT}`);
        console.log(`Test MongoDB connection is on http://localhost:${PORT}/api/test-db`);
        console.log(`Test AWS S3 connection is on http://localhost:${PORT}/api/test-aws`)
    });
}

startServer();