import mongoose from 'mongoose';

async function mongoInit(mongoUri: string): Promise<void> {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
  } catch (e) {
    // add logger later
    console.error(e);
  }

  console.log('MongoDB initialized.');
  return;
}

export default mongoInit;
