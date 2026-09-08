const mongoose = require("mongoose");

const itinerarySchema = new mongoose.Schema(
    {
        trip: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trip",
            required: true
        },

        day: {
            type: Number,
            required: true
        },

        date: {
            type: Date,
            required: true
        },

        activities: [
            {
                title: {
                    type: String,
                    required: true
                },

                description: {
                    type: String,
                    default: ""
                },

                location: {
                    type: String,
                    default: ""
                },

                startTime: {
                    type: String,
                    default: ""
                },

                endTime: {
                    type: String,
                    default: ""
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

const Itinerary = mongoose.model("Itinerary", itinerarySchema);

module.exports = Itinerary;