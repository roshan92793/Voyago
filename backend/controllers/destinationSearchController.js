const mongoose = require("mongoose");
const Destination = require("../models/destination");
const { searchLocation } = require("../services/geoapifyService");
const { getDestinationImages, dedupeImages } = require("../services/imageService");
const { getWeatherForLocation } = require("../services/weatherService");
const { getFamousPlaces } = require("../services/attractionService");

const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const normalizeSearchTerm = (value = "") => String(value).trim().toLowerCase().replace(/[^a-z0-9\s]/gi, "").replace(/\s+/g, " ");
const isDbReady = () => mongoose.connection.readyState === 1;

const isPlaceholderImage = (value) => {
    if (!value) return true;
    return /example\.com|placehold|dummy|loremflickr|picsum/i.test(value);
};

const normalizeStoredImage = (image) => {
    if (typeof image === "string") {
        const normalized = {
            id: image,
            url: image,
            thumbnail: image,
            description: "Destination image",
            photographer: "Voyago",
            photographerUrl: "https://unsplash.com/"
        };

        return isPlaceholderImage(image) ? null : normalized;
    }

    if (!image || !image.url) {
        return null;
    }

    if (isPlaceholderImage(image.url)) {
        return null;
    }

    return {
        id: image.id || image.url,
        url: image.url,
        thumbnail: image.thumbnail || image.url,
        description: image.description || "Destination image",
        photographer: image.photographer || "Voyago",
        photographerUrl: image.photographerUrl || "https://unsplash.com/"
    };
};

const serializeDestination = (destination) => {
    const raw = destination && typeof destination.toObject === "function" ? destination.toObject() : { ...(destination || {}) };
    const images = dedupeImages((raw.images || []).map((image) => normalizeStoredImage(image)).filter(Boolean));
    const docId = raw._id || raw.id || raw._doc?._id || raw._doc?.id;

    return {
        ...raw,
        _id: docId,
        id: docId,
        image: images[0]?.url || raw.image || "",
        images
    };
};

const getImageUrlsFromDestination = (destination) => {
    const rawImages = Array.isArray(destination?.images) ? destination.images : [];

    return dedupeImages(
        rawImages
            .map((image) => (typeof image === "string" ? image : image?.url))
            .filter((value) => Boolean(value) && !isPlaceholderImage(value))
    );
};

const buildDestinationDescription = (destination) => {
    const city = destination.name || "this destination";
    const country = destination.country || "the world";

    return `Discover ${city} in ${country}. From scenic viewpoints and cultural landmarks to local food, beaches, and memorable experiences, this destination offers a rich mix of travel moments for every kind of explorer.`;
};

const buildDestinationHighlights = (destinationName, country, attractions = []) => {
    const baseHighlights = [
        `${destinationName || "This destination"} highlights`,
        "Scenic viewpoints and landmarks",
        "Local culture and authentic food",
        "Relaxed sightseeing and memorable day trips",
        "Nature, heritage, and adventure"
    ];

    const attractionNames = [...new Set(
        (attractions || [])
            .map((place) => place?.name)
            .filter(Boolean)
            .slice(0, 3)
    )];

    if (attractionNames.length) {
        return attractionNames.slice(0, 5);
    }

    return baseHighlights.slice(0, 5);
};

const findExistingDestination = async (query) => {
    if (!isDbReady()) return null;

    const cleanQuery = String(query).trim();
    if (!cleanQuery) return null;

    const q = escapeRegex(cleanQuery);
    const normalizedSearch = normalizeSearchTerm(cleanQuery);

    try {
        const existing = await Destination.findOne({
            $or: [
                { placeId: { $regex: `^${q}$`, $options: "i" } },
                { name: { $regex: `^${q}$`, $options: "i" } },
                { name: { $regex: `^${q}.*`, $options: "i" } },
                { location: { $regex: `^${q}$`, $options: "i" } },
                { country: { $regex: `^${q}$`, $options: "i" } }
            ]
        }).sort({ createdAt: -1 });

        if (existing) return existing;

        return await Destination.findOne({
            $or: [
                { name: { $regex: new RegExp(q, "i") } },
                { location: { $regex: new RegExp(q, "i") } },
                { country: { $regex: new RegExp(q, "i") } }
            ]
        }).sort({ createdAt: -1 });
    } catch (error) {
        try {
            const fallback = await Destination.findOne({
                $or: [
                    { name: normalizeSearchTerm(cleanQuery) },
                    { location: normalizeSearchTerm(cleanQuery) },
                    { country: normalizeSearchTerm(cleanQuery) }
                ]
            }).sort({ createdAt: -1 });

            if (fallback) return fallback;
        } catch (fallbackError) {
            console.warn("Database lookup skipped for search query:", query, fallbackError.message);
        }

        console.warn("Database lookup skipped for search query:", query, error.message);
        return null;
    }
};

const findOrCreateFromGeoData = async (geoData, searchTerm, extras = {}) => {
    const normalizedName = geoData.name || searchTerm;
    const destinationPayload = {
        name: normalizedName,
        description: extras.description || buildDestinationDescription({
            name: normalizedName,
            country: geoData.country || "Unknown country"
        }),
        location: geoData.location || normalizedName,
        state: geoData.state || "",
        continent: geoData.continent || geoData.region || "",
        country: geoData.country || "Unknown",
        latitude: geoData.latitude,
        longitude: geoData.longitude,
        placeId: geoData.placeId || undefined,
        images: Array.isArray(extras.images) ? extras.images : [],
        attractions: extras.attractions || [],
        highlights: extras.highlights || [],
        famousPlaces: extras.famousPlaces || [],
        weather: extras.weather || null,
        bestTimeToVisit: extras.bestTimeToVisit || "Year-round",
        rating: extras.rating || 0
    };

    if (!isDbReady()) {
        return destinationPayload;
    }

    try {
        const baseQuery = geoData.placeId
            ? { placeId: geoData.placeId }
            : {
                $or: [
                    { name: { $regex: `^${escapeRegex(normalizedName)}$`, $options: "i" } },
                    { location: { $regex: `^${escapeRegex(geoData.location || normalizedName)}$`, $options: "i" } }
                ]
            };

        if (!geoData.placeId && geoData.country) {
            baseQuery.$or.push({ country: { $regex: `^${escapeRegex(geoData.country)}$`, $options: "i" } });
        }

        const existing = await Destination.findOne(baseQuery).sort({ createdAt: -1 });

        if (existing) {
            const hasChanges = Object.keys(destinationPayload).some((key) => existing[key] !== destinationPayload[key]);

            if (hasChanges) {
                Object.assign(existing, destinationPayload);
                await existing.save();
            }

            return existing;
        }

        const created = await Destination.create(destinationPayload);
        return created;
    } catch (error) {
        console.warn("Database save skipped for destination search:", searchTerm, error.message);

        try {
            const created = await Destination.create(destinationPayload);
            return created;
        } catch (createError) {
            return destinationPayload;
        }
    }
};

const searchDestination = async (req, res) => {
    try {
        const q = req.query.q;

        if (!q || !String(q).trim()) {
            return res.status(400).json({
                success: false,
                message: "Search query 'q' is required"
            });
        }

        const searchTerm = String(q).trim();

        let destination = await findExistingDestination(searchTerm);

        if (destination) {
            const hasUsableWeather = (weather) => !!weather && typeof weather === "object" && (
                weather.temperature != null ||
                weather.condition ||
                weather.summary ||
                weather.feelsLike != null
            );

            const hasFullTourismData = Array.isArray(destination.famousPlaces) && destination.famousPlaces.length > 0;
            const shouldRefreshDestination = !hasUsableWeather(destination.weather) || !hasFullTourismData;

            if (!shouldRefreshDestination) {
                return res.status(200).json({
                    success: true,
                    source: "database",
                    destination: serializeDestination(destination)
                });
            }

            const geoData = await searchLocation(searchTerm).catch(() => null) || {
                name: destination.name,
                country: destination.country,
                location: destination.location,
                state: destination.state,
                latitude: destination.latitude,
                longitude: destination.longitude,
                continent: destination.continent,
                placeId: destination.placeId
            };

            if (!geoData || geoData.latitude == null || geoData.longitude == null) {
                const weather = await getWeatherForLocation({
                    latitude: destination.latitude,
                    longitude: destination.longitude,
                    name: destination.name,
                    country: destination.country
                });

                if (weather) {
                    destination.weather = weather;
                    await destination.save();
                }

                return res.status(200).json({
                    success: true,
                    source: "database",
                    destination: serializeDestination(destination)
                });
            }

            const imageObjects = await getDestinationImages(`${geoData.name} ${geoData.country}`).catch(() => []);
            const imageUrls = dedupeImages(imageObjects.map((image) => image.url)).slice(0, 10);
            const weather = await getWeatherForLocation({ latitude: geoData.latitude, longitude: geoData.longitude, name: geoData.name, country: geoData.country });
            const attractionCandidates = await getFamousPlaces(geoData.name, geoData.country, geoData.state, geoData.latitude, geoData.longitude);
            const famousPlaces = await Promise.all(
                attractionCandidates.slice(0, 8).map(async (place) => {
                    const placeImages = await getDestinationImages(`${geoData.name} ${place.name}`).catch(() => []);
                    const uniqueImages = dedupeImages(placeImages.map((image) => image.url)).slice(0, 3);
                    return {
                        name: place.name,
                        description: place.description,
                        location: place.location || geoData.state || geoData.country,
                        category: place.category,
                        bestTime: place.bestTime || "Best during daylight hours",
                        images: uniqueImages
                    };
                })
            );

            const highlights = buildDestinationHighlights(geoData.name || searchTerm, geoData.country, famousPlaces);

            destination.description = buildDestinationDescription({ name: geoData.name || searchTerm, country: geoData.country || "Unknown country" });
            destination.images = dedupeImages([...(Array.isArray(destination.images) ? destination.images : []), ...imageUrls]).slice(0, 10);
            destination.famousPlaces = famousPlaces;
            destination.highlights = highlights;
            destination.attractions = famousPlaces.map((place) => place.name);
            destination.weather = weather || destination.weather || null;
            destination.location = geoData.location || destination.location || geoData.name || searchTerm;
            destination.state = geoData.state || destination.state || "";
            destination.country = geoData.country || destination.country || "Unknown";
            destination.latitude = geoData.latitude ?? destination.latitude;
            destination.longitude = geoData.longitude ?? destination.longitude;
            destination.continent = geoData.continent || destination.continent || "";
            await destination.save();

            return res.status(200).json({
                success: true,
                source: "database",
                destination: serializeDestination(destination)
            });
        }

        let geoData;
        try {
            geoData = await searchLocation(searchTerm);
        } catch (error) {
            return res.status(502).json({
                success: false,
                message: "Unable to find this destination right now. Please try again later.",
                error: process.env.NODE_ENV === "development" ? error.message : undefined
            });
        }

        if (!geoData) {
            return res.status(404).json({
                success: false,
                message: "Destination not found"
            });
        }

        let imageObjects = [];
        try {
            imageObjects = await getDestinationImages(`${geoData.name} ${geoData.country}`);
        } catch (error) {
            imageObjects = [];
        }

        const imageUrls = dedupeImages(imageObjects.map((image) => image.url)).slice(0, 10);
        const weather = await getWeatherForLocation({ latitude: geoData.latitude, longitude: geoData.longitude, name: geoData.name, country: geoData.country });
        const attractionCandidates = await getFamousPlaces(geoData.name, geoData.country, geoData.state, geoData.latitude, geoData.longitude);
        const famousPlaces = await Promise.all(
            attractionCandidates.slice(0, 8).map(async (place) => {
                const placeImages = await getDestinationImages(`${geoData.name} ${place.name}`).catch(() => []);
                const uniqueImages = dedupeImages(placeImages.map((image) => image.url)).slice(0, 3);
                return {
                    name: place.name,
                    description: place.description,
                    location: place.location || geoData.state || geoData.country,
                    category: place.category,
                    bestTime: place.bestTime || "Best during daylight hours",
                    images: uniqueImages
                };
            })
        );

        const highlights = buildDestinationHighlights(geoData.name || searchTerm, geoData.country, famousPlaces);

        const destinationPayload = {
            name: geoData.name || searchTerm,
            description: buildDestinationDescription({
                name: geoData.name || searchTerm,
                country: geoData.country || "Unknown country"
            }),
            location: geoData.location || geoData.name || searchTerm,
            state: geoData.state || "",
            continent: geoData.continent || geoData.region || "",
            country: geoData.country || "Unknown",
            latitude: geoData.latitude,
            longitude: geoData.longitude,
            placeId: geoData.placeId || undefined,
            images: imageUrls,
            attractions: famousPlaces.map((place) => place.name),
            highlights,
            famousPlaces,
            weather,
            bestTimeToVisit: "Year-round",
            rating: 0
        };

        const savedDestination = await findOrCreateFromGeoData(geoData, searchTerm, destinationPayload);
        const finalDestination = savedDestination && typeof savedDestination === "object" ? savedDestination : destinationPayload;

        if (finalDestination && typeof finalDestination.save === "function") {
            finalDestination.description = destinationPayload.description;
            finalDestination.location = destinationPayload.location;
            finalDestination.state = destinationPayload.state;
            finalDestination.continent = destinationPayload.continent;
            finalDestination.country = destinationPayload.country;
            finalDestination.latitude = destinationPayload.latitude;
            finalDestination.longitude = destinationPayload.longitude;
            finalDestination.images = dedupeImages([...(Array.isArray(finalDestination.images) ? finalDestination.images : []), ...imageUrls]).slice(0, 10);
            finalDestination.attractions = famousPlaces.map((place) => place.name);
            finalDestination.highlights = highlights;
            finalDestination.famousPlaces = famousPlaces;
            finalDestination.weather = weather;
            finalDestination.bestTimeToVisit = "Year-round";
            await finalDestination.save();
        }

        return res.status(201).json({
            success: true,
            source: "external",
            destination: serializeDestination(finalDestination)
        });
    } catch (error) {
        console.error("Destination search error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to search destination"
        });
    }
};

module.exports = {
    searchDestination
};
