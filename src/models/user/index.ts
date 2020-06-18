import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { config } from '../../config';
const { jwtSecret } = config;

// [type interfaces for Document, Model]
interface User extends mongoose.Document {
  username: string;
  hashedPassword: string;
  setPassword(password: string): Promise<void>;
  checkPassword(password: string): Promise<boolean>;
  serialize(): any;
  generateToken(): string;
}

interface UserModel extends mongoose.Model<User> {
  findByUsername(username: string): Promise<User>;
}

// [user schema]
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  hashedPassword: { type: String, required: true },
});

// [instance methods]
userSchema.methods.setPassword = async function (
  password: string,
): Promise<void> {
  const hash = await bcrypt.hash(password, 10);
  this.hashedPassword = hash;
};

userSchema.methods.checkPassword = async function (
  password: string,
): Promise<boolean> {
  const result = await bcrypt.compare(password, this.hashedPassword);
  return result;
};

userSchema.methods.serialize = function (): any {
  const data = this.toJSON();
  delete data.hashedPassword;
  return data;
};

userSchema.methods.generateToken = function () {
  const token = jwt.sign(
    {
      _id: this.id,
      username: this.username,
    },
    jwtSecret,
    {
      expiresIn: '7d',
    },
  );
  return token;
};

// [static methods]
userSchema.statics.findByUsername = async function (
  username: string,
): Promise<User> {
  return await this.findOne({ username });
};

const User = mongoose.model<User, UserModel>('User', userSchema);

export default User;
