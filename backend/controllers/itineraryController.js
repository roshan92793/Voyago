const Itinerary = require("../models/Itinerary");
const Trip = require("../models/trip");

// CREATE ITINERARY
const createItinerary = async (req, res) => {
    try {
        const { trip, day, date, activities } = req.body;

        if (!trip || !day || !date) {
            return res.status(400).json({
                success: false,
                message: "Please provide trip, day and date"
            });
        }

        // Make sure the trip belongs to logged-in user
        const userTrip = await Trip.findOne({
            _id: trip,
            user: req.user.userId
        });

        if (!userTrip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found"
            });
        }

        const itinerary = await Itinerary.create({
            trip,
            day,
            date,
            activities: activities || []
        });

        res.status(201).json({
            success: true,
            message: "Itinerary created successfully",
            itinerary
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to create itinerary"
        });
    }
};


// GET ITINERARY FOR A TRIP
const getTripItinerary = async (req, res) => {
    try {
        const trip = await Trip.findOne({
            _id: req.params.tripId,
            user: req.user.userId
        });

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found"
            });
        }

        const itinerary = await Itinerary.find({
            trip: req.params.tripId
        }).sort({ day: 1 });

        res.status(200).json({
            success: true,
            count: itinerary.length,
            itinerary
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch itinerary"
        });
    }
};


// UPDATE ITINERARY
const updateItinerary = async (req, res) => {
    try {
        const itinerary = await Itinerary.findById(req.params.id);

        if (!itinerary) {
            return res.status(404).json({
                success: false,
                message: "Itinerary not found"
            });
        }

        const trip = await Trip.findOne({
            _id: itinerary.trip,
            user: req.user.userId
        });

        if (!trip) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        const updatedItinerary = await Itinerary.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            message: "Itinerary updated successfully",
            itinerary: updatedItinerary
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to update itinerary"
        });
    }
};


// DELETE ITINERARY
const deleteItinerary = async (req, res) => {
    try {
        const itinerary = await Itinerary.findById(req.params.id);

        if (!itinerary) {
            return res.status(404).json({
                success: false,
                message: "Itinerary not found"
            });
        }

        const trip = await Trip.findOne({
            _id: itinerary.trip,
            user: req.user.userId
        });

        if (!trip) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        await Itinerary.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Itinerary deleted successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to delete itinerary"
        });
    }
};


module.exports = {
    createItinerary,
    getTripItinerary,
    updateItinerary,
    deleteItinerary
};