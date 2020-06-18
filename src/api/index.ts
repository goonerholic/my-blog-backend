import express from 'express';
import posts from './posts';
import auth from './auth';

const api = express.Router();

api.use('/posts', posts);
api.use('/auth', auth);

export default api;
