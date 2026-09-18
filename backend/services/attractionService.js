const axios = require("axios");

const normalizeAttractionResult = (item) => {
    const name = item?.name || item?.title || "Popular attraction";
    const description = item?.description || item?.snippet || `Explore ${name} in this destination.`;
    const location = item?.location || item?.city || item?.state || "Popular location";

    return {
        name,
        description,
        location,
        category: item?.category || "Must-visit",
        bestTime: item?.bestTime || "Best enjoyed during the day",
        images: Array.isArray(item?.images) ? item.images.filter(Boolean) : []
    };
};

const getFamousPlaces = async (destinationName, country, state, latitude, longitude) => {
    const queryBase = [destinationName, state, country].filter(Boolean).join(" ").trim();
    const searchQueries = [
        queryBase,
        `${queryBase} famous places`,
        `${queryBase} attractions`,
        `${queryBase} tourist attractions`,
        `${queryBase} landmarks`,
        `${queryBase} sightseeing`
    ].filter((value, index, array) => value && array.indexOf(value) === index);

    const fields = [
        "name",
        "title",
        "description",
        "snippet",
        "location",
        "city",
        "state",
        "category",
        "bestTime",
        "images"
    ];

    const fallback = [
        "Beaches",
        "Historic landmarks",
        "Natural viewpoints",
        "Cultural sites",
        "Local markets",
        "Scenic viewpoints"
    ];

    for (const query of searchQueries) {
        try {
            const response = await axios.get("https://en.wikipedia.org/w/api.php", {
                params: {
                    action: "opensearch",
                    search: query,
                    limit: 8,
                    namespace: 0,
                    format: "json",
                    origin: "*"
                },
                timeout: 15000
            });

            const titles = Array.isArray(response.data?.[1]) ? response.data[1] : [];
            const descriptions = Array.isArray(response.data?.[2]) ? response.data[2] : [];
            const links = Array.isArray(response.data?.[3]) ? response.data[3] : [];

            if (titles.length) {
                const attractions = titles
                    .map((title, index) => ({
                        name: title,
                        description: descriptions[index] || `Visit ${title} for a memorable travel experience.`,
                        location: state || country || destinationName || "Destination",
                        category: fallback[index % fallback.length],
                        bestTime: "Best during daylight hours",
                        images: []
                    }))
                    .filter((item) => item.name && item.name.toLowerCase() !== (destinationName || "").toLowerCase())
                    .slice(0, 8);

                if (attractions.length) {
                    return attractions.map(normalizeAttractionResult);
                }
            }

            if (links.length) {
                return links
                    .slice(0, 8)
                    .map((link, index) => ({
                        name: new URL(link).pathname.split("/").filter(Boolean).join(" ") || `Attraction ${index + 1}`,
                        description: `Discover a popular attraction in ${destinationName}.`,
                        location: state || country || destinationName || "Destination",
                        category: fallback[index % fallback.length],
                        bestTime: "Best during daylight hours",
                        images: []
                    }))
                    .map(normalizeAttractionResult);
            }
        } catch (error) {
            continue;
        }
    }

    return [
        {
            name: `${destinationName || "Popular"} Landmark`,
            description: `Explore the iconic charm of ${destinationName || "this destination"} and its well-loved experiences.`,
            location: state || country || destinationName || "Destination",
            category: "Must-visit",
            bestTime: "Best during daylight hours",
            images: []
        },
        {
            name: `${destinationName || "Popular"} Viewpoint`,
            description: `Enjoy local scenery and memorable perspectives that make ${destinationName || "this destination"} stand out.`,
            location: state || country || destinationName || "Destination",
            category: "Scenic",
            bestTime: "Early morning or sunset",
            images: []
        }
    ];
};

module.exports = {
    getFamousPlaces
};
