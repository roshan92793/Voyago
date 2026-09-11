const Wishlist = require("../models/wishlist");
const Destination = require("../models/destination");

// ADD TO WISHLIST
const addToWishlist = async (req, res) => {
    try {
        const { destination } = req.body;

        if (!destination) {
            return res.status(400).json({
                success: false,
                message: "Destination ID is required"
            });
        }

        // Check destination exists
        const existingDestination = await Destination.findById(destination);

        if (!existingDestination) {
            return res.status(404).json({
                success: false,
                message: "Destination not found"
            });
        }

        // Check if already in wishlist
        const alreadyExists = await Wishlist.findOne({
            user: req.user.userId,
            destination
        });

        if (alreadyExists) {
            return res.status(400).json({
                success: false,
                message: "Destination already in wishlist"
            });
        }

        const wishlist = await Wishlist.create({
            user: req.user.userId,
            destination
        });

        res.status(201).json({
            success: true,
            message: "Destination added to wishlist",
            wishlist
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to add destination to wishlist"
        });
    }
};


// GET MY WISHLIST
const getWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.find({
            user: req.user.userId
        }).populate(
            "destination",
            "name description location state country images rating"
        );

        res.status(200).json({
            success: true,
            count: wishlist.length,
            wishlist
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch wishlist"
        });
    }
};


// REMOVE FROM WISHLIST
const removeFromWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOneAndDelete({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: "Wishlist item not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Destination removed from wishlist"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to remove destination from wishlist"
        });
    }
};


module.exports = {
    addToWishlist,
    getWishlist,
    removeFromWishlist
};