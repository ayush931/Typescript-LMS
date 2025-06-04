import mongoose from 'mongoose';

mongoose.set('strictQuery', false);

const connectionToDB = async () => {
  try {
    // connection to the mongodb database
    const { connection } = await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://localhost:27017/learning'
    );
    // showing on which host the device is connected
    if (connection) {
      console.log(`Connection to DB: ${connection.host}`);
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectionToDB;
