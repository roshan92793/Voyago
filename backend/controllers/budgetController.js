const Budget = require("../models/budget");
const Trip = require("../models/trip");

// Add an expense
const addExpense = async (req, res) => {
  try {
    const { trip, category, amount, description, date } = req.body;

    const tripData = await Trip.findOne({
      _id: trip,
      user: req.user.userId,
    });

    if (!tripData) {
      return res.status(404).json({
        success: false,
        message: "Trip not found or access denied",
      });
    }

    const expense = await Budget.create({
      trip,
      user: req.user.userId,
      category,
      amount,
      description,
      date,
    });

    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all expenses for a trip
const getExpenses = async (req, res) => {
  try {
    const { tripId } = req.params;

    const trip = await Trip.findOne({
      _id: tripId,
      user: req.user.userId,
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found or access denied",
      });
    }

    const expenses = await Budget.find({
      trip: tripId,
      user: req.user.userId,
    }).sort({ date: -1 });

    const totalSpent = expenses.reduce(
      (total, expense) => total + expense.amount,
      0
    );

    res.status(200).json({
      success: true,
      budget: trip.budget,
      totalSpent,
      remaining: trip.budget - totalSpent,
      expenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update an expense
const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Budget.findOne({
      _id: id,
      user: req.user.userId,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    const updatedExpense = await Budget.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      expense: updatedExpense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete an expense
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Budget.findOneAndDelete({
      _id: id,
      user: req.user.userId,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
};