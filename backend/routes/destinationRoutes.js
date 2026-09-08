const express = require("express");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
    createDestination,
    getDestinations,
    getDestinationById,
    updateDestination,
    deleteDestination
} = require("../controllers/destinationController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getDestinations);

router.get("/:id", getDestinationById);

router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    createDestination
);

router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    updateDestination
);

router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deleteDestination
);

module.exports = router;