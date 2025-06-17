import mongoose from "mongoose";
import User from "../models/user.model.js";


class Db{
  myDb;

  async connectDb() {
    try {
      this.myDb = await mongoose.connect(process.env.MONGO_URI)
      const host = this.myDb.connection.host
      console.log({success: true, message: host})
      return {success: true, message: host}
    } catch (error) {
      console.error(`Error occured while connecting to DB: ${error.message}`);
      return {success: false, message: 'Invalid input'}
    }
  }
};

const db = new Db();

export default db;