const Destination = require("../models/destination");
const { getDestinationImages } = require("../services/imageService");

const fetchAndSaveDestinationImages = async (req, res) => {
    try {
        const { destinationId } = req.params;

        if (!destinationId) {
            return res.status(400).json({
                success: false,
                message: "Destination ID is required"
            });
        }

        // Find destination
        const destination = await Destination.findById(destinationId);

        if (!destination) {
            return res.status(404).json({
                success: false,
                message: "Destination not found"
            });
        }

        // If images already exist, don't call Unsplash again
        if (destination.images && destination.images.length > 0) {
            return res.status(200).json({
                success: true,
                message: "Images already exist for this destination",
                destination: {
                    id: destination._id,
                    name: destination.name
                },
                images: destination.images
            });
        }

        // Fetch images from Unsplash
        const images = await getDestinationImages(destination.name);

        // Extract only URLs
        const imageUrls = images.map((image) => image.url);

        // Save URLs in MongoDB
        destination.images = imageUrls;

        await destination.save();

        return res.status(200).json({
            success: true,
            message: "Destination images fetched and saved successfully",
            destination: {
                id: destination._id,
                name: destination.name
            },
            images: destination.images
        });

    } catch (error) {
        console.error("Image Controller Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch and save destination images"
        });
    }
};

module.exports = {
    fetchAndSaveDestinationImages
};