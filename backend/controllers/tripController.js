const Trip = require("../models/trip");

// CREATE TRIP
const createTrip = async (req, res) => {
    try {
        const { destination, title, startDate, endDate, budget, notes } = req.body;

        if (!destination || !title || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "Please provide destination, title, start date and end date"
            });
        }

        const trip = await Trip.create({
            user: req.user.userId,
            destination,
            title,
            startDate,
            endDate,
            budget,
            notes
        });

        res.status(201).json({
            success: true,
            message: "Trip created successfully",
            trip
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to create trip"
        });
    }
};


// GET MY TRIPS
const getMyTrips = async (req, res) => {
    try {
        const trips = await Trip.find({
            user: req.user.userId
        }).populate("destination", "name location images");

        res.status(200).json({
            success: true,
            count: trips.length,
            trips
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch trips"
        });
    }
};


// GET SINGLE TRIP
const getTripById = async (req, res) => {
    try {
        const trip = await Trip.findOne({
            _id: req.params.id,
            user: req.user.userId
        }).populate("destination");

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found"
            });
        }

        res.status(200).json({
            success: true,
            trip
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch trip"
        });
    }
};


// UPDATE TRIP
const updateTrip = async (req, res) => {
    try {
        const trip = await Trip.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.userId
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Trip updated successfully",
            trip
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to update trip"
        });
    }
};


// DELETE TRIP
const deleteTrip = async (req, res) => {
    try {
        const trip = await Trip.findOneAndDelete({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Trip deleted successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to delete trip"
        });
    }
};


module.exports = {
    createTrip,
    getMyTrips,
    getTripById,
    updateTrip,
    deleteTrip
};