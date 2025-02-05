import mongoose from "mongoose";

export default async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI || "");
        return "MongoDB Connected Successfully";
    } catch (err) {
        console.error("DB connection failed:", err);
        throw err;
    }
}
