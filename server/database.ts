import mongoose from "mongoose";

let isMongoConnected = false;

const connectDB = async (): Promise<boolean> => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/formcraft";

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });

    isMongoConnected = true;
    console.log("✅ MongoDB Connected Successfully");
    return true;
  } catch (error) {
    console.warn(
      "⚠️ MongoDB Connection Failed - Using localStorage fallback for development",
    );
    console.warn(
      "   To use MongoDB, ensure MongoDB is running or set MONGODB_URI to a cloud instance",
    );
    isMongoConnected = false;
    return false;
  }
};

// Handle connection events
mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB Disconnected - Falling back to localStorage");
  isMongoConnected = false;
});

mongoose.connection.on("error", (error) => {
  console.warn("⚠️ MongoDB Error:", error.message);
  isMongoConnected = false;
});

export const isConnected = () => isMongoConnected;
export default connectDB;
