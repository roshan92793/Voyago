const express = require("express");

const {
    registerUser,
    loginUser
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const validate = require("../middleware/validate");

const {
    registerValidation,
    loginValidation
} = require("../middleware/authValidation");

const router = express.Router();

router.post(
    "/register",
    registerValidation,
    validate,
    registerUser
);

router.post(
    "/login",
    loginValidation,
    validate,
    loginUser
);

router.get(
    "/profile",
    authMiddleware,
    (req, res) => {
        res.json({
            success: true,
            message: "You are authenticated!",
            user: req.user
        });
    }
);

module.exports = router;