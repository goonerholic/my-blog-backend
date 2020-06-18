import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { config } from '../../config';
const { jwtSecret } = config;

interface DecodedUserInfo {
  _id: string;
  username: string;
}

function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies['access_token'];
  console.log(token);
  if (!token) return next();
  try {
    const decoded = <DecodedUserInfo>jwt.verify(token, jwtSecret);
    res.locals.user = {
      _id: decoded._id,
      username: decoded.username,
    };
    console.log(decoded);
    return next();
  } catch (e) {
    return next();
  }
}

export default jwtMiddleware;
