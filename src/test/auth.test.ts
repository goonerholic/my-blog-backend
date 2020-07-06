import express from 'express';
import serverInit from './../loaders/serverLoader';
import request from 'supertest';
import mongoInit from './../loaders/mongoLoader';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Post from '../models/post';
import User from '../models/user';

const { ObjectId } = mongoose.Types;
dotenv.config();

const mongoUri = process.env.MONGO_URI_TEST;
const app = express();

const authArgument = {
  username: 'testId',
  password: 'password',
};

beforeAll(async () => {
  await mongoInit(mongoUri || '');
  serverInit(app);
});

afterAll(async () => {
  await User.deleteMany({});
});

describe('Register Endpoint', () => {
  it('should send 200 and valid _id', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(authArgument);
    expect(res.status).toEqual(200);
    expect(ObjectId.isValid(res.body?._id)).toEqual(true);
  });
});
