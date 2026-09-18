const axios = require("axios");

const buildUnsplashQueries = (query) => {
    const raw = String(query || "").trim();

    if (!raw) {
        return [];
    }

    const normalized = raw.replace(/\s+/g, " ");
    const variants = [
        `${normalized} travel`,
        `${normalized} India travel`,
        `${normalized} beach travel`,
        `${normalized} coastline travel`,
        `${normalized} sunset travel`,
        `${normalized} tourist attraction travel`,
        `${normalized} landscape travel`,
        `${normalized} travel destination`
    ];

    return [...new Set(variants.filter(Boolean))];
};

const normalizeUnsplashPhoto = (photo, fallbackQuery) => {
    const url = photo?.urls?.regular || photo?.urls?.full || photo?.urls?.small || "";

    if (!url) {
        return null;
    }

    return {
        id: photo?.id || `${fallbackQuery}-${Date.now()}`,
        url,
        thumbnail: photo?.urls?.small || url,
        description: photo?.alt_description || `${fallbackQuery} travel`,
        photographer: photo?.user?.name || "Unsplash",
        photographerUrl: photo?.user?.links?.html || "https://unsplash.com/"
    };
};

const dedupeImages = (images) => {
    const seen = new Set();

    return images.filter((image) => {
        const key = image?.url || image;

        if (!key || seen.has(key)) {
            return false;
        }

        seen.add(key);
        return true;
    });
};

const getDestinationImages = async (query) => {
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;

    if (!accessKey) {
        return [];
    }

    const queries = buildUnsplashQueries(query);

    if (!queries.length) {
        return [];
    }

    let images = [];

    try {
        for (const searchQuery of queries) {
            const response = await axios.get(
                "https://api.unsplash.com/search/photos",
                {
                    params: {
                        query: searchQuery,
                        per_page: 5,
                        orientation: "landscape",
                        page: 1
                    },
                    headers: {
                        Authorization: `Client-ID ${accessKey}`
                    },
                    timeout: 20000
                }
            );

            const found = (response.data?.results || [])
                .map((photo) => normalizeUnsplashPhoto(photo, searchQuery))
                .filter(Boolean);

            images = [...images, ...found];

            if (dedupeImages(images).length >= 10) {
                break;
            }
        }

        return dedupeImages(images).slice(0, 10);
    } catch (error) {
        return [];
    }
};

module.exports = {
    getDestinationImages,
    buildUnsplashQueries,
    dedupeImages
};