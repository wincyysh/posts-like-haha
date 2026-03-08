// frontend/src/components/FeedPost.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, patchPosts, deletePosts } from './../store/feedSlices';

