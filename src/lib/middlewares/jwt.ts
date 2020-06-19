import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { config } from '../../config';
import User from '../../models/user';
const { jwtSecret } = config;

interface DecodedUserInfo {
  _id: string;
  username: string;
  iat: number;
  exp: number;
}

async function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies['access_token'];
  if (!token) return next();
  try {
    const decoded = <DecodedUserInfo>jwt.verify(token, jwtSecret);
    res.locals.user = {
      _id: decoded._id,
      username: decoded.username,
    };

    // if token expires in 3.5 days, reissue token.
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp - now < 60 * 60 * 24 * 3.5) {
      const user = await User.findById(decoded._id);
      const token = user?.generateToken();
      res.cookie('access_token', token, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
      });
    }
    return next();
  } catch (e) {
    return next();
  }
}

export default jwtMiddleware;
