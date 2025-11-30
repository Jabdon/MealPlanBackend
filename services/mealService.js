// services/mealService.js this is a sample
const Meal = require("../models/mealModel");
const Ingredient = require("../models/ingredientModel");
const mongoose = require("mongoose");
const {
  saveIngredients,
  getIngredientsByMeal,
} = require("./ingredientService");

async function getAllMyMeals(userId) {
  // not implemented
  const meals = await Meal.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId), // ← filter by user
      },
    },
    {
      $lookup: {
        from: "ingredients",
        localField: "_id",
        foreignField: "meal",
        as: "ingredients",
      },
    },
  ]);

  return meals;
}

async function createAMeal(mealData) {
  // start
  const session = await mongoose.startSession();
  session.startTransaction();

  // Create the meal
  const meal = await Meal.create([mealData], { session });
  let mealDoc = meal[0];
  // Save ingredients if provided
  if (mealData.ingredients && mealData.ingredients.length > 0) {
    const ingredients = await saveIngredients(
      mealDoc._id,
      mealData.ingredients,
      session
    );
    // Recalculate nutrition facts
    const nutritionFacts = computeNutritionFacts(
      ingredients,
      mealDoc.servingSize
    );
    mealDoc = await Meal.findByIdAndUpdate(
      mealDoc._id,
      { nutritionFacts: nutritionFacts },
      { session }
    );

    // Done!
    await session.commitTransaction();
    session.endSession();
  }

  return await getMealWithIngredients(mealDoc._id);
}

async function getMealWithIngredients(mealId) {
  // use aggregate to return meal and matching ingredients as one object
  const meal = await Meal.findById(mealId).lean();
  if (!meal) throw new Error("Meal not found");

  meal.ingredients = await getIngredientsByMeal(mealId);
  return meal;
}

function computeNutritionFacts(listOfIngredients, servingSize) {
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
  totalNutrition.calories = totalNutrition.calories / servingSize;
  totalNutrition.protein = totalNutrition.protein / servingSize;
  totalNutrition.fat = totalNutrition.fat / servingSize;
  totalNutrition.carbs = totalNutrition.carbs / servingSize;

  return totalNutrition;
}

module.exports = { createAMeal, getMealWithIngredients, getAllMyMeals };
