const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  foodId: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  nutritionFacts: {
    calories: {
      type: Number,
      required: true,
      min: 0,
    },
    protein: {
      type: Number,
      required: true,
      min: 0,
    },
    fat: {
      type: Number,
      required: false,
      default: 0,
    },
    carbs: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  quantity: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  meal: {
    type: mongoose.Schema.ObjectId,
    ref: "Meal",
    required: [true, "There should be a meal associated with this ingredient"],
  },
});

const Ingredient = mongoose.model("Ingredient", ingredientSchema);

module.exports = Ingredient;
