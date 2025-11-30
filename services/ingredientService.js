const Ingredient = require("./../models/ingredientModel");

const appId = process.env.EDAMAM_APP_ID;
const appKey = process.env.EDAMAM_APP_KEY;

async function fetchFood(parseText) {
  // fetch https://api.edamam.com/api/food-database/v2/parser
  const params = new URLSearchParams();
  params.append("app_id", appId);
  params.append("app_key", appKey);
  params.append("ingr", parseText);
  const response = await fetch(
    `https://api.edamam.com/api/food-database/v2/parser?${params.toString()}`,
    {
      method: "GET",
    }
  );
  const data = await response.json();
  const listOfIngredients = data.hints.map((hint) => hint.food);
  return listOfIngredients;
}

async function getFoodNutrients(
  foodID,
  quantity = 2,
  measureURI = "http://www.edamam.com/ontologies/edamam.owl#Measure_tablespoon"
) {
  // fecth https://api.edamam.com/api/food-database/v2/nutrients
  const body = {
    ingredients: [
      {
        quantity: quantity,
        measureURI: measureURI,
        foodId: foodID,
      },
    ],
  };

  const jsonBody = JSON.stringify(body);
  console.log(jsonBody);

  const params = new URLSearchParams();
  params.append("app_id", appId);
  params.append("app_key", appKey);
  const response = await fetch(
    `https://api.edamam.com/api/food-database/v2/nutrients?${params.toString()}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Important for JSON payloads
      },
      body: jsonBody,
    }
  );
  const data = await response.json();
  return mappedIngredient(data);
}

async function saveIngredients(mealId, ingredientData, session = null) {
  // save using mongoose
  // 2. Add product reference to each item
  const ingredientDocs = ingredientData.map((i) => ({
    ...i,
    meal: mealId,
  }));
  const ingredients = await Ingredient.insertMany(
    ingredientDocs,
    session ? { session } : {}
  );

  return ingredients;
}

function mappedIngredient(ingredientData) {
  return {
    foodId: ingredientData.ingredients[0].parsed[0].foodId,
    label: ingredientData.ingredients[0].parsed[0].food,
    quantity: ingredientData.ingredients[0].parsed[0].quantity,
    unit: ingredientData.ingredients[0].parsed[0].measureURI,
    nutritionFacts: {
      calories: ingredientData.totalNutrients.ENERC_KCAL.quantity,
      protein: ingredientData.totalNutrients.PROCNT.quantity,
      fat: ingredientData.totalNutrients.FAT.quantity,
      carbs: ingredientData.totalNutrients.CHOCDF.quantity,
    },
  };
}

async function getIngredientsByMeal(mealId) {
  return await Ingredient.find({ meal: mealId });
}

module.exports = {
  fetchFood,
  getFoodNutrients,
  saveIngredients,
  getIngredientsByMeal,
};
