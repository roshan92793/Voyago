const mongoose = require("mongoose");
const Destination = require("../models/destination");
const { getDestinationImages } = require("../services/imageService");
const { getWeatherForLocation } = require("../services/weatherService");

const fallbackDestinations = [
    {
        _id: "fallback-goa",
        id: "fallback-goa",
        name: "Goa",
        description: "A laid-back coastal escape with palm-fringed beaches, Portuguese heritage, local seafood, and vibrant markets.",
        location: "Goa",
        state: "Goa",
        country: "India",
        continent: "Asia",
        latitude: 15.2993,
        longitude: 74.124,
        images: [
            "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"
        ],
        attractions: ["Palolem Beach", "Basilica of Bom Jesus", "Dudhsagar Falls", "Fontainhas"],
        highlights: ["Palolem Beach", "Basilica of Bom Jesus", "Dudhsagar Falls", "Fontainhas"],
        famousPlaces: [],
        bestTimeToVisit: "Nov - Feb",
        rating: 4.7
    },
    {
        _id: "fallback-jaipur",
        id: "fallback-jaipur",
        name: "Jaipur",
        description: "Rajasthan’s Pink City is known for grand forts, royal palaces, colourful bazaars, and traditional Rajasthani cuisine.",
        location: "Jaipur",
        state: "Rajasthan",
        country: "India",
        continent: "Asia",
        latitude: 26.9124,
        longitude: 75.7873,
        images: [
            "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80",
            "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800&q=80"
        ],
        attractions: ["Amber Fort", "Hawa Mahal", "City Palace", "Jantar Mantar"],
        highlights: ["Amber Fort", "Hawa Mahal", "City Palace", "Jantar Mantar"],
        famousPlaces: [],
        bestTimeToVisit: "Oct - Mar",
        rating: 4.6
    },
    {
        _id: "fallback-manali",
        id: "fallback-manali",
        name: "Manali",
        description: "A Himalayan hill town with snow-capped peaks, pine forests, river valleys, and year-round adventure activities.",
        location: "Manali",
        state: "Himachal Pradesh",
        country: "India",
        continent: "Asia",
        latitude: 32.2432,
        longitude: 77.1892,
        images: [
            "https://images.unsplash.com/photo-1626621331169-5f34be280ed9?w=800&q=80",
            "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80"
        ],
        attractions: ["Solang Valley", "Atal Tunnel", "Hadimba Temple", "Old Manali"],
        highlights: ["Solang Valley", "Atal Tunnel", "Hadimba Temple", "Old Manali"],
        famousPlaces: [],
        bestTimeToVisit: "Mar - Jun",
        rating: 4.7
    }
];

const hasUsableWeather = (weather) => !!weather && typeof weather === "object" && (
    weather.temperature != null ||
    weather.condition ||
    weather.summary ||
    weather.feelsLike != null
);

const dedupeImages = (images = []) => {
    const seen = new Set();

    return images.filter((image) => {
        const value = typeof image === "string" ? image : image?.url;

        if (!value || seen.has(value)) {
            return false;
        }

        seen.add(value);
        return true;
    });
};

const isPlaceholderImage = (image) => {
    const value = typeof image === "string" ? image : image?.url;
    if (!value) return true;
    return /example\.com|placehold|dummy|loremflickr|picsum/i.test(value);
};

const enrichDestinationImages = async (destination) => {
    if (!destination) return destination;

    const existingImages = Array.isArray(destination.images) ? destination.images : [];
    const validImages = dedupeImages(existingImages.filter((image) => !isPlaceholderImage(image)));

    if (validImages.length >= 5) {
        destination.images = validImages.slice(0, 10);
        return destination;
    }

    try {
        const fetched = await getDestinationImages(`${destination.name || "Destination"} ${destination.country || "travel"}`);
        const merged = dedupeImages([
            ...validImages,
            ...fetched.map((image) => image.url)
        ]).slice(0, 10);

        if (merged.length > validImages.length) {
            destination.images = merged;
            await destination.save();
        }
    } catch (error) {
        if (validImages.length) {
            destination.images = validImages.slice(0, 10);
        }
    }

    return destination;
};

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
        if (mongoose.connection.readyState !== 1) {
            const fallbackWithWeather = await Promise.all(
                fallbackDestinations.map(async (destination) => {
                    const weather = await getWeatherForLocation({
                        latitude: destination.latitude,
                        longitude: destination.longitude,
                        name: destination.name,
                        country: destination.country
                    });

                    return {
                        ...destination,
                        weather
                    };
                })
            );

            return res.status(200).json({
                success: true,
                count: fallbackWithWeather.length,
                destinations: fallbackWithWeather
            });
        }

        const destinations = await Destination.find();

        res.status(200).json({
            success: true,
            count: destinations.length,
            destinations
        });

    } catch (error) {
        console.error(error);

        const fallbackWithWeather = await Promise.all(
            fallbackDestinations.map(async (destination) => ({
                ...destination,
                weather: await getWeatherForLocation({
                    latitude: destination.latitude,
                    longitude: destination.longitude,
                    name: destination.name,
                    country: destination.country
                })
            }))
        );

        return res.status(200).json({
            success: true,
            count: fallbackWithWeather.length,
            destinations: fallbackWithWeather
        });
    }
};


// GET SINGLE DESTINATION
const getDestinationById = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            const fallback = fallbackDestinations.find((destination) =>
                String(destination._id) === String(req.params.id) ||
                String(destination.name).toLowerCase() === String(req.params.id).toLowerCase()
            );

            if (!fallback) {
                return res.status(404).json({
                    success: false,
                    message: "Destination not found"
                });
            }

            const weather = await getWeatherForLocation({
                latitude: fallback.latitude,
                longitude: fallback.longitude,
                name: fallback.name,
                country: fallback.country
            });

            return res.status(200).json({
                success: true,
                destination: { ...fallback, weather }
            });
        }

        const destination = await Destination.findById(req.params.id);

        if (!destination) {
            return res.status(404).json({
                success: false,
                message: "Destination not found"
            });
        }

        if (!hasUsableWeather(destination.weather) && destination.latitude != null && destination.longitude != null) {
            const refreshedWeather = await getWeatherForLocation({
                latitude: destination.latitude,
                longitude: destination.longitude,
                name: destination.name,
                country: destination.country
            });

            if (refreshedWeather) {
                destination.weather = refreshedWeather;
                await destination.save();
            }
        }

        const enrichedDestination = await enrichDestinationImages(destination);

        res.status(200).json({
            success: true,
            destination: enrichedDestination
        });

    } catch (error) {
        console.error(error);

        const fallback = fallbackDestinations.find((destination) =>
            String(destination._id) === String(req.params.id) ||
            String(destination.name).toLowerCase() === String(req.params.id).toLowerCase()
        );

        if (!fallback) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch destination"
            });
        }

        const weather = await getWeatherForLocation({
            latitude: fallback.latitude,
            longitude: fallback.longitude,
            name: fallback.name,
            country: fallback.country
        });

        return res.status(200).json({
            success: true,
            destination: { ...fallback, weather }
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