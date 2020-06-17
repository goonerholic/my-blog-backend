import { Request, Response } from 'express';
import Post from './../../models/posts';

// POST
export async function write(req: Request, res: Response) {
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
  try {
    const posts = await Post.find();
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
