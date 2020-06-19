import { Request, Response, NextFunction } from 'express';

function checkOwnPost(req: Request, res: Response, next: NextFunction) {
  const { user, post } = res.locals;
  if (post.user._id.toString() !== user._id) {
    res.status(403).send('Forbbiden.');
    return;
  }
  return next();
}

export default checkOwnPost;
