import { Request, Response, NextFunction } from 'express';
import Post from './../../models/posts';
import mongoose from 'mongoose';
import Joi from '@hapi/joi';

const { ObjectId } = mongoose.Types;

// [middleware]
// Object ID validation
export function checkObjectId(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    res.status(400).send('Bad request.');
    return;
  }
  return next();
}

// [Controllers]
// POST
export async function write(req: Request, res: Response) {
  // Request body validation
  const schema = Joi.object().keys({
    title: Joi.string().required(),
    body: Joi.string().required(),
    tags: Joi.array().items(Joi.string().required()),
  });
  // Handling bad request
  const result = schema.validate(req.body);
  if (result.error) {
    res.status(400).send('Bad request');
    return;
  }

  const { title, body, tags } = req.body;
  const post = new Post({
    title,
    body,
    tags,
  });

  try {
    await post.save();
    res.status(200).send(post);
  } catch (e) {
    res.status(500).send(e.message);
  }
}

// GET
export async function list(req: Request, res: Response) {
  const page = parseInt(<string>req.query.page || '1');

  try {
    const posts = await Post.find()
      .sort({ _id: -1 })
      .limit(10)
      .skip((page - 1) * 10)
      .lean();

    const postCount = await Post.countDocuments();
    res.set('Last-Page', Math.ceil(postCount / 10).toString());
    const trimmedPost = posts.map((post) => ({
      ...post,
      body: post.body.length < 200 ? post.body : `${post.body.slice(0, 200)}`,
    }));
    res.status(200).send(posts);
  } catch (e) {
    res.status(500).send(e.message);
  }
}

// GET:id
export async function read(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post) {
      res.status(404).send('Post not found.');
      return;
    }
    res.status(200).send(post);
  } catch (e) {
    res.status(500).send(e.message);
  }
}

// DELETE:id
export async function remove(req: Request, res: Response) {
  const { id } = req.params;
  try {
    await Post.findByIdAndRemove(id);
    res.status(200).send('Post removed.');
  } catch (e) {
    res.status(500).send(e.message);
  }
}

// PATCH:id
export async function update(req: Request, res: Response) {
  const { id } = req.params;
  // Request body validation
  const schema = Joi.object().keys({
    title: Joi.string(),
    body: Joi.string(),
    tags: Joi.array().items(Joi.string()),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    res.status(400).send('Bad request.');
    return;
  }

  try {
    const post = await Post.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!post) {
      res.status(404).send('Post not found.');
    }
    res.status(200).send(post);
  } catch (e) {
    res.status(500).send(e.message);
  }
}
