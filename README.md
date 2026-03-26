# posts-like-haha

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

### 1. Backend Install Dependencies
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