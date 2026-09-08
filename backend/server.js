const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const destinationRoutes = require("./routes/destinationRoutes");
const app = express();

// Middleware
app.use(cors());

app.use(express.json());

// Connect MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/destinations", destinationRoutes);
// Test route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to Voyago API 🌍"
    });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Voyago server running on port ${PORT}`);
});