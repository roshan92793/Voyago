const express = require("express");

const {
    createTrip,
    getMyTrips,
    getTripById,
    updateTrip,
    deleteTrip
} = require("../controllers/tripController");

const authMiddleware = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

const {
    tripValidation,
    tripIdValidation
} = require("../middleware/tripValidation");

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    tripValidation,
    validate,
    createTrip
);

router.get(
    "/",
    authMiddleware,
    getMyTrips
);

router.get(
    "/:id",
    authMiddleware,
    tripIdValidation,
    validate,
    getTripById
);

router.put(
    "/:id",
    authMiddleware,
    tripIdValidation,
    tripValidation,
    validate,
    updateTrip
);

router.delete(
    "/:id",
    authMiddleware,
    tripIdValidation,
    validate,
    deleteTrip
);

module.exports = router;