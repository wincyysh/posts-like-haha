# posts-like-haha

A Full Stack news feed web application built with React, Redux Toolkit, MongoDB, and AWS S3.

## Project Goals

- connect to MongoDB database
- store images to AWS S3
- Implement Redux Toolkit for state management
- Build a social news feed with posts, reactions and images

##  Technology
- MongoDB
- AWS S3
- AWS Elastic Beanstalk
- AWS CloudFront

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

### 1. Install Dependencies
```bash
# Backend
cd backend
npm install
```