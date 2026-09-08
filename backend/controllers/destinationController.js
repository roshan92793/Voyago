const Destination = require("../models/destination");

// CREATE DESTINATION
const createDestination = async (req, res) => {
    try {
        const destination = await Destination.create(req.body);

        res.status(201).json({
            success: true,
            message: "Destination created successfully",
            destination
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to create destination"
        });
    }
};


// GET ALL DESTINATIONS
const getDestinations = async (req, res) => {
    try {
        const destinations = await Destination.find();

        res.status(200).json({
            success: true,
            count: destinations.length,
            destinations
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch destinations"
        });
    }
};


// GET SINGLE DESTINATION
const getDestinationById = async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id);

        if (!destination) {
            return res.status(404).json({
                success: false,
                message: "Destination not found"
            });
        }

        res.status(200).json({
            success: true,
            destination
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch destination"
        });
    }
};


// UPDATE DESTINATION
const updateDestination = async (req, res) => {
    try {
        const destination = await Destination.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!destination) {
            return res.status(404).json({
                success: false,
                message: "Destination not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Destination updated successfully",
            destination
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to update destination"
        });
    }
};


// DELETE DESTINATION
const deleteDestination = async (req, res) => {
    try {
        const destination = await Destination.findByIdAndDelete(
            req.params.id
        );

        if (!destination) {
            return res.status(404).json({
                success: false,
                message: "Destination not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Destination deleted successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to delete destination"
        });
    }
};


module.exports = {
    createDestination,
    getDestinations,
    getDestinationById,
    updateDestination,
    deleteDestination
};