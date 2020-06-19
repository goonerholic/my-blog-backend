import { Request, Response, NextFunction } from 'express';
import Joi from '@hapi/joi';
import User from '../../models/user';

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // request body validation
  const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(6).max(20).required(),
    password: Joi.string().required(),
  });
  const result = schema.validate(req.body);
  if (result.error) {
    res.status(400).send('Bad request.');
    return;
  }

  const { username, password } = req.body;
  try {
    // check if username already exists
    const exists = await User.findByUsername(username);
    if (exists) {
      res.status(409).send('Username already exists.');
      return;
    }

    // save username and send serialized user info
    const user = new User({ username });
    await user.setPassword(password);
    await user.save();

    const token = user.generateToken();
    res.cookie('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });

    res.status(200).send(user.serialize());
  } catch (e) {
    res.status(500).send(e.message);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  // login
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(401).send('Unauthorized.');
    return;
  }

  try {
    const user = await User.findByUsername(username);

    if (!user) {
      res.send(401).send('Unauthorized.');
      return;
    }

    const valid = await user.checkPassword(password);
    if (!valid) {
      res.status(401).send('Unauthorized.');
      return;
    }
    const token = user.generateToken();
    res.cookie('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
    res.status(200).send(user.serialize());
  } catch (e) {
    res.status(500).send(e.message);
  }
}

export function check(req: Request, res: Response, next: NextFunction) {
  // check log in status
  const { user } = res.locals;
  if (!user) {
    res.status(401).send('Unauthorized.');
    return;
  }
  res.status(200).send(user);
}

export function logout(req: Request, res: Response, next: NextFunction) {
  // logout
  res.clearCookie('access_token');
  res.status(204).send('Signed out.');
}
