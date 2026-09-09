const { body, param } = require("express-validator");

const tripValidation = [
    body("destination")
        .notEmpty()
        .withMessage("Destination is required")
        .isMongoId()
        .withMessage("Invalid destination ID"),

    body("title")
        .trim()
        .notEmpty()
        .withMessage("Trip title is required"),

    body("startDate")
        .notEmpty()
        .withMessage("Start date is required")
        .isISO8601()
        .withMessage("Invalid start date"),

    body("endDate")
        .notEmpty()
        .withMessage("End date is required")
        .isISO8601()
        .withMessage("Invalid end date"),

    body("budget")
        .optional()
        .isNumeric()
        .withMessage("Budget must be a number"),

    body("notes")
        .optional()
        .isString()
        .withMessage("Notes must be text")
];

const tripIdValidation = [
    param("id")
        .isMongoId()
        .withMessage("Invalid trip ID")
];

module.exports = {
    tripValidation,
    tripIdValidation
};