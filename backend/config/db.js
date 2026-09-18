const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 8000,
            retryWrites: true,
            maxPoolSize: 10
        });

        console.log("MongoDB connected successfully");
        return true;
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        console.warn("Continuing without MongoDB. The app will run in fallback mode for live destination and weather data.");
        return false;
    }
};

module.exports = connectDB;