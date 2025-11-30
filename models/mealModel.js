const mongoose = require("mongoose");
const Ingredient = require("./ingredientModel");

const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: [55, "A Meal name should be less or equal to 55"],
  },
  dietaryType: {
    type: String,
    required: true,
  },
  planFor: {
    type: [String],
    required: true,
    default: [],
  },
  servingSize: {
    type: Number,
    required: true,
  },
  isTakeout: {
    type: Boolean,
    required: true,
    default: false,
  },
  dateCreation: {
    type: Date,
    default: Date.now,
    required: true,
  },
  nutritionFacts: {
    calories: {
      type: Number,
      min: 0,
      default: 0,
    },
    protein: {
      type: Number,
      min: 0,
      default: 0,
    },
    fat: {
      type: Number,
      default: 0,
    },
    carbs: {
      type: Number,
      default: 0,
    },
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "There should be a user associated with this meal"],
  },
});

// mealSchema.pre("findOneAndUpdate", async function (next) {
//   const mealId = this.getQuery()._id;
//   const servingSize = this.getQuery().servingSize;

//   const ingredients = await Ingredient.find({ meal: mealId });

//   const total = this.calculateMealNutritionFacts(ingredients, servingSize);

//   this.set({ nutritionFacts: total });

//   next();
// });

mealSchema.methods.calculateMealNutritionFacts = function (
  listOfIngredients,
  servingSize
) {
  const totalNutrition = {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
  };
  console.log("list of ingrdients:", listOfIngredients);
  console.log("servingSize:", servingSize);
  listOfIngredients.forEach((ingredient) => {
    totalNutrition.calories += ingredient.nutritionFacts.calories;
    totalNutrition.protein += ingredient.nutritionFacts.protein;
    totalNutrition.fat += ingredient.nutritionFacts.fat;
    totalNutrition.carbs += ingredient.nutritionFacts.carbs;
  });
  // calculate per serving
  this.nutritionFacts.calories = totalNutrition.calories / servingSize;
  this.nutritionFacts.protein = totalNutrition.protein / servingSize;
  this.nutritionFacts.fat = totalNutrition.fat / servingSize;
  this.nutritionFacts.carbs = totalNutrition.carbs / servingSize;

  return {
    calories: totalNutrition.calories / servingSize,
    protein: totalNutrition.protein / servingSize,
    fat: totalNutrition.fat / servingSize,
    carbs: totalNutrition.carbs / servingSize,
  };
};

const Meal = mongoose.model("Meal", mealSchema);

module.exports = Meal;
