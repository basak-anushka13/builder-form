import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || process.env.DATABASE_URL;

    if (!mongoURI) {
      console.log("No MongoDB URI found, using fallback storage");
      return false;
    }

    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
    return true;
  } catch (error) {
    console.log("MongoDB connection failed, using fallback storage:", error);
    return false;
  }
};

export default connectDB;
