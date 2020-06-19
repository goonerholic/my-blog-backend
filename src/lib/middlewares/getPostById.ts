import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import Post from '../../models/post';

const { ObjectId } = mongoose.Types;

// [middleware]
// Object ID validation
async function getPostById(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    res.status(400).send('Bad request.');
    return;
  }
  try {
    const post = await Post.findById(id);
    if (!post) {
      res.status(404).send('Post not found.');
      return;
    }
    res.locals.post = post;
    return next();
  } catch (e) {
    res.status(500).send(e.message);
  }
}

export default getPostById;
