const mongoose = require("mongoose");
const destinationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        location: {
            type: String,
            required: true
        },

        state: {
            type: String,
            required: true
        },

        country: {
            type: String,
            default: "India"
        },

        images: {
            type: [String],
            default: []
        },

        attractions: {
            type: [String],
            default: []
        },

        bestTimeToVisit: {
            type: String
        },

        averageBudget: {
            type: Number
        },

        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        }
    },
    {
        timestamps: true
    }
);

const Destination = mongoose.model("Destination", destinationSchema);
module.exports = Destination;