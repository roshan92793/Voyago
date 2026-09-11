const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const destinationRoutes = require("./routes/destinationRoutes");
const blogRoutes = require("./routes/blogRoutes");
const tripRoutes = require("./routes/tripRoutes");
const itineraryRoutes = require("./routes/itineraryRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const budgetRoutes = require("./routes/budgetRoute");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

// Middleware
app.use(cors());

app.use(express.json());

// Connect MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/trip", tripRoutes);
app.use("/api/itineraries", itineraryRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/admin", require("./routes/adminRoutes"));
app.use(errorMiddleware);

// Test route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to Voyago API 🌍"
    });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT,"0.0.0.0", () => {
    console.log(`Voyago server running on port ${PORT}`);
});