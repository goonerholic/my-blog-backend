import express from 'express';
import { write, read, list, remove, update } from './posts.ctrl';

const posts = express.Router();

posts.get('/', list);
posts.post('/', write);
posts.get('/:id', read);
posts.delete('/:id', remove);
posts.patch('/:id', update);

export default posts;
