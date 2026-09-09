const User = require("../models/user");
const Destination = require("../models/destination");
const Trip = require("../models/trip");
const Review = require("../models/review");

// GET /api/admin/dashboard
const getDashboardStats = async (req, res) => {
    try {
        const [
            totalUsers,
            totalDestinations,
            totalTrips,
            totalReviews,
            recentUsers,
            recentTrips,
            recentReviews
        ] = await Promise.all([
            User.countDocuments(),
            Destination.countDocuments(),
            Trip.countDocuments(),
            Review.countDocuments(),

            User.find()
                .select("-password")
                .sort({ createdAt: -1 })
                .limit(5),

            Trip.find()
                .populate("user", "name email")
                .populate("destination", "name")
                .sort({ createdAt: -1 })
                .limit(5),

            Review.find()
                .populate("user", "name email")
                .populate("destination", "name")
                .sort({ createdAt: -1 })
                .limit(5)
        ]);

        res.status(200).json({
            success: true,
            data: {
                statistics: {
                    totalUsers,
                    totalDestinations,
                    totalTrips,
                    totalReviews
                },
                recentUsers,
                recentTrips,
                recentReviews
            }
        });

    } catch (error) {
        console.error("Admin dashboard error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard data",
            error: error.message
        });
    }
};

module.exports = {
    getDashboardStats
};