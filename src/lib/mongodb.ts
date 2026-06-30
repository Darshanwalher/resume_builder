import mongoose from "mongoose";

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL!);
    console.log("connected to db");
  } catch (error) {
    console.log("error in connecting db ", error);
  }
};

export default connectToDb;
