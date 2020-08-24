import express from 'express';
import checkLoggedIn from './../../../lib/middlewares/checkLoggedIn';

const comments = express.Router();

comments.get('/', listComments);
comments.post('/', checkLoggedIn, writeComment);
comments.delete('/:commentId', checkLoggedIn, removeComment);
comments.patch('/:commentId', checkLoggedIn, updateComment);

export default comments;
