import express from 'express';
import { write, read, list, remove, update } from './posts.ctrl';
import checkLoggedIn from '../../lib/middlewares/checkLoggedIn';
import getPostById from '../../lib/middlewares/getPostById';
import checkOwnPost from '../../lib/middlewares/checkOwnPost';

const posts = express.Router();

posts.get('/', list);
posts.post('/', checkLoggedIn, write);
posts.get('/:id', getPostById, read);
posts.delete('/:id', checkLoggedIn, getPostById, checkOwnPost, remove);
posts.patch('/:id', checkLoggedIn, getPostById, checkOwnPost, update);

export default posts;
