import express from 'express';
import posts from './posts';

const api = express.Router();

api.use('/posts', posts);

export default api;
