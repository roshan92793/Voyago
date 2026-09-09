const express = require("express");

const router = express.Router();

const {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} = require("../controllers/budgetController");

const authMiddleware = require("../middleware/authMiddleware");

// Add expense
router.post("/", authMiddleware, addExpense);

// Get expenses for a trip
router.get("/trip/:tripId", authMiddleware, getExpenses);

// Update expense
router.put("/:id", authMiddleware, updateExpense);

// Delete expense
router.delete("/:id", authMiddleware, deleteExpense);

module.exports = router;