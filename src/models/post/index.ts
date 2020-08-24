import mongoose from 'mongoose';

interface Comment {
  user: string;
  body: string;
}

interface Post extends mongoose.Document {
  title: string;
  body: string;
  tags: string[];
  user: {
    _id: mongoose.Types.ObjectId;
    username: string;
  };
  comments: Comment[];
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
  comments: {
    user: String,
    body: String,
  },
});

const Post = mongoose.model<Post>('Post', postSchema);

export default Post;
