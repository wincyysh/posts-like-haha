# posts-like-haha
[Try the live app here:](https://d2iwi61q6n3ty1.cloudfront.net)

A Full Stack news feed web application built with React, Redux Toolkit, MongoDB, and AWS S3.

## Project Goals

- connect to MongoDB database
- store images to AWS S3
- Implement Redux Toolkit for state management
- Build a social news feed with posts, reactions and images

##  Technology
| Layer    | Technology |
|----------|------------|
| Frontend | React 19, Redux Toolkit, Axios, Vite |
| Backend  | Node.js, Express 5, Mongoose |
| Database | MongoDB Atlas |
| Image Storage | AWS S3 |
| Hosting | AWS Elastic Beanstalk (backend), AWS S3 + CloudFront (frontend)

## Project Structure
```
.
├── backend
│   ├── backend.zip
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
├── frontend
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   └── src
│       ├── api
│       │   └── posts.jsx
│       ├── app.css
│       ├── app.jsx
│       ├── components
│       │   ├── ContentCreator.css
│       │   ├── ContentCreator.jsx
│       │   ├── FeedPost.css
│       │   └── FeedPost.jsx
│       ├── main.jsx
│       └── store
│           ├── feedSlices.jsx
│           └── store.jsx
├── README.md
└── vite.config.js

```

---

## Quick Start
 
### Local Development Setup Prerequisites
- Node.js 20+
- MongoDB Atlas account
- AWS account with S3 bucket

## Backend
### 1. Install Dependencies
```bash
# Backend
cd backend
npm install
```

### 2. Create `backend/.env`:
```
MONGODB_URI=your_mongodb_atlas_connection_string
AWS_REGION=your_region
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_BUCKET_NAME=your_bucket_name
PORT=3000
```

### 3.Start the server
```
npm run dev
```

Test endpoints:
```
GET  http://localhost:3000/             # server health check
GET  http://localhost:3000/api/test-db  # MongoDB connection test
GET  http://localhost:3000/api/test-aws # AWS S3 connection test
```
 
## Frontend
 
### 1. Install dependencies:
```bash
cd frontend
npm install
```
 
### 2. Create `frontend/.env`:
```
VITE_API_URL=http://localhost:3000/api
```
 
### 3. Start the dev server:
```bash
npm run dev
```

## API Routes
 
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/posts` | Fetch all posts (sorted by date desc) |
| POST | `/api/posts` | Create a new post (multipart/form-data) |
| PATCH | `/api/posts/:id/react` | Add a reaction (likes or hahas) |
| DELETE | `/api/posts/:id` | Delete a post and its S3 image |
| GET | `/api/image-url?key=xxx` | Get a signed S3 URL for an image |
| GET | `/api/test-db` | Test MongoDB connection |
| GET | `/api/test-aws` | Test AWS S3 connection |

### POST /api/posts (multipart/form-data)
```
content      string    required
authorName   string
authorId     string
image        file      optional
```
 
### PATCH /api/posts/:id/react
```json
{ "reactionType": "likes" }
// or
{ "reactionType": "hahas" }
```

---
 
## MongoDB Schema
 
```js
const postSchema = new Schema({
    content:  { type: String, required: true },
    author:   { id: String, name: String },
    imageKey: String,                           // S3 object key, not full URL
    reactions: {
        likes: { type: Number, default: 0 },
        hahas: { type: Number, default: 0 }
    },
    date: { type: Date, default: Date.now }
});
```
 
---
