const { body, param } = require("express-validator");

const destinationValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Destination name is required"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required"),

    body("location")
        .trim()
        .notEmpty()
        .withMessage("Location is required"),

    body("state")
        .trim()
        .notEmpty()
        .withMessage("State is required"),

    body("country")
        .optional()
        .trim(),

    body("images")
        .optional()
        .isArray()
        .withMessage("Images must be an array"),

    body("attractions")
        .optional()
        .isArray()
        .withMessage("Attractions must be an array"),

    body("averageBudget")
        .optional()
        .isNumeric()
        .withMessage("Average budget must be a number"),

    body("rating")
        .optional()
        .isFloat({ min: 0, max: 5 })
        .withMessage("Rating must be between 0 and 5")
];

const idValidation = [
    param("id")
        .isMongoId()
        .withMessage("Invalid destination ID")
];

module.exports = {
    destinationValidation,
    idValidation
};