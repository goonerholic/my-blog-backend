import mongoose from 'mongoose';

interface Post extends mongoose.Document {
  title: string;
  body: string;
  tags: string[];
  user: {
    _id: mongoose.Types.ObjectId;
    username: string;
  };
}

const postSchema = new mongoose.Schema({
  title: String,
  body: String,
  tags: [String],
  publishedDate: {
    type: Date,
    default: Date.now,
  },
  user: {
    _id: mongoose.Types.ObjectId,
    username: String,
  },
});

const Post = mongoose.model<Post>('Post', postSchema);

export default Post;
