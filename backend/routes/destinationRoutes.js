const express = require("express");

const {
    createDestination,
    getDestinations,
    getDestinationById,
    updateDestination,
    deleteDestination
} = require("../controllers/destinationController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const validate = require("../middleware/validate");

const {
    destinationValidation,
    idValidation
} = require("../middleware/destinationValidation");

const router = express.Router();

router.get("/", getDestinations);

router.get(
    "/:id",
    idValidation,
    validate,
    getDestinationById
);

router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    destinationValidation,
    validate,
    createDestination
);

router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    idValidation,
    destinationValidation,
    validate,
    updateDestination
);

router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    idValidation,
    validate,
    deleteDestination
);

module.exports = router;