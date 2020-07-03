import { Request, Response, NextFunction } from 'express';
import Post from '../../models/post';
import Joi from '@hapi/joi';
import sanitizeHtml from 'sanitize-html';

// helpers
// const sanitizeOption = {
//   allowedTags: [
//     'h1',
//     'h2',
//     'b',
//     'i',
//     'u',
//     's',
//     'p',
//     'ul',
//     'ol',
//     'li',
//     'blockquote',
//     'a',
//     'img',
//     'pre',
//     'span',
//     'br',
//   ],
//   allowedAttributes: {
//     a: ['href', 'name', 'target'],
//     img: ['src'],
//     li: ['class'],
//   },
//   allowedSchemes: ['data', 'http'],
// };

function removeHtmlAndShorten(body: string) {
  const filtered = sanitizeHtml(body, {
    allowedTags: [],
  });
  return filtered.length > 200 ? `${filtered.slice(0, 200)}...` : filtered;
}

// [Controllers]
// POST
export async function write(req: Request, res: Response) {
  // Request body validation
  const schema = Joi.object().keys({
    title: Joi.string().required(),
    body: Joi.string().required(),
    tags: Joi.array().items(Joi.string()),
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
    body, // sanitizeHtml(body, sanitizeOption),
    tags,
    user: res.locals.user,
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

  if (page < 1) {
    res.status(400).send('No post.');
    return;
  }

  const { tag, username } = req.query;

  const mongoQuery = {
    ...(<string>username ? { 'user.username': username } : {}),
    ...(<string>tag ? { tags: tag } : {}),
  };

  try {
    const posts = await Post.find(mongoQuery)
      .sort({ _id: -1 })
      .limit(10)
      .skip((page - 1) * 10)
      .lean();

    const postCount = await Post.countDocuments(mongoQuery);
    res.set(
      'Last-Page',
      (postCount === 0 ? 1 : Math.ceil(postCount / 10)).toString(),
    );
    const trimmedPost = posts.map((post) => ({
      ...post,
      body: removeHtmlAndShorten(post.body),
    }));
    res.status(200).send(trimmedPost);
  } catch (e) {
    res.status(500).send(e.message);
  }
}

// GET:id
export async function read(req: Request, res: Response) {
  res.send(res.locals.post);
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

  // const nextData = { ...req.body };
  // if (nextData.body) {
  //   nextData.body = sanitizeHtml(nextData.body, sanitizeOption);
  // }

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
