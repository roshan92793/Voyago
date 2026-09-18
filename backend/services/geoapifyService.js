const axios = require("axios");

const GEOAPIFY_BASE_URL = "https://api.geoapify.com/v1/geocode/search";

const normalizeGeoapifyResult = (feature) => {
    const props = feature?.properties || {};
    const name = props.name || props.city || props.address_line1 || "Unknown destination";

    return {
        name,
        location: props.city || props.name || props.address_line1 || name,
        state: props.state || props.region || "",
        country: props.country || "Unknown",
        latitude: Number(props.lat ?? feature?.geometry?.coordinates?.[1]) || null,
        longitude: Number(props.lon ?? feature?.geometry?.coordinates?.[0]) || null,
        placeId: props.place_id || null,
        formattedAddress: props.formatted || props.address_line1 || name,
        raw: feature
    };
};

const searchLocation = async (query) => {
    if (!query || !String(query).trim()) {
        throw new Error("A search query is required");
    }

    const apiKey = process.env.GEOAPIFY_API_KEY;

    if (!apiKey) {
        throw new Error("GEOAPIFY_API_KEY is not configured");
    }

    try {
        const response = await axios.get(GEOAPIFY_BASE_URL, {
            params: {
                text: String(query).trim(),
                apiKey,
                limit: 5
            },
            timeout: 15000
        });

        const features = Array.isArray(response.data?.features) ? response.data.features : [];

        if (!features.length) {
            return null;
        }

        const normalized = features
            .map(normalizeGeoapifyResult)
            .filter((item) => item.latitude && item.longitude);

        return normalized[0] || null;
    } catch (error) {
        const message = error.response?.data?.message || error.message || "Geoapify search failed";
        throw new Error(message);
    }
};

module.exports = {
    searchLocation
};
