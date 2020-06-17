import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 4000,
  mongoUri: process.env.MONGO_URI || '',
};
