// scripts/addGoogleFields.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/User.js"

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const addFieldsToUsers = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Cập nhật tất cả user hiện có: nếu chưa có googleId thì thêm googleId: null, provider: 'local'
    const result = await User.updateMany(
      { },
      { 
        $set: { 
          googleId: null,
          provider: "local"
        } 
      }
    );

    console.log(`Matched ${result.matchedCount} users, modified ${result.modifiedCount} users`);

    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
};

addFieldsToUsers();