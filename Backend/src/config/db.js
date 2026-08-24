import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

export async function connectDB(uri) {
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    console.log("Connected to Local MongoDB");
    return false;
  } catch (err) {
    console.log("Local MongoDB not found. Starting In-Memory MongoDB...");
    const mongod = await MongoMemoryServer.create();
    const memoryUri = mongod.getUri();
    await mongoose.connect(memoryUri);
    console.log("Connected to In-Memory MongoDB!");
    return true; // signifies it's in-memory and needs seeding
  }
}
