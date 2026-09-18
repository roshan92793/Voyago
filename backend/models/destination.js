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
            required: true,
            trim: true
        },

        location: {
            type: String,
            required: true,
            trim: true
        },

        state: {
            type: String,
            default: ""
        },

        continent: {
            type: String,
            default: ""
        },

        country: {
            type: String,
            default: "India"
        },

        placeId: {
            type: String,
            unique: true,
            sparse: true
        },

        latitude: {
            type: Number
        },

        longitude: {
            type: Number
        },

        images: {
            type: [String],
            default: []
        },

        attractions: {
            type: [String],
            default: []
        },

        highlights: {
            type: [String],
            default: []
        },

        famousPlaces: {
            type: [
                {
                    name: { type: String, trim: true },
                    description: { type: String, trim: true },
                    location: { type: String, trim: true },
                    category: { type: String, trim: true },
                    bestTime: { type: String, trim: true },
                    images: { type: [String], default: [] }
                }
            ],
            default: []
        },

        weather: {
            type: Object,
            default: null
        },

        bestTimeToVisit: {
            type: String,
            default: ""
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