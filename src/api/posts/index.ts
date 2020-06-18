import express from 'express';
import { write, read, list, remove, update, checkObjectId } from './posts.ctrl';

const posts = express.Router();

posts.get('/', list);
posts.post('/', write);
posts.get('/:id', checkObjectId, read);
posts.delete('/:id', checkObjectId, remove);
posts.patch('/:id', checkObjectId, update);

export default posts;
