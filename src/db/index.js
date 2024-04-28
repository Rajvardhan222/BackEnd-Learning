import mongoose from "mongoose";
import { DB_NAME } from "../constants/constants.js";

let connectDB = async () => {
    try {
        const connectionInstence = await mongoose.connect(
            `${process.env.MONGODB_URL}${DB_NAME}`
        );

        console.log(connectionInstence.connection.host);
    } catch (error) {
        console.log("mongoDB Connection Error", error);
        process.exit(1);
    }
};

export default connectDB;
