const Ingredient = require("./../models/ingredientModel");
const {
  fetchFood,
  getFoodNutrients,
} = require("../services/ingredientService");
const AppError = require("./../Utils/appError");
const catchAsync = require("./../Utils/catchAsync");
const factory = require("./handlerFactory");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getIngredientNutrients = catchAsync(async (req, res, next) => {
  const foodId = req.query.foodId;
  const ingredients = await getFoodNutrients(foodId);

  res.status(200).json({
    status: "Success",
    data: {
      ingredients,
    },
  });
});

exports.searchIngredients = catchAsync(async (req, res, next) => {
  const parse = req.query.text;
  const ingredients = await fetchFood(parse);

  res.status(200).json({
    status: "Success",
    data: {
      ingredients,
    },
  });
});

exports.createIngredient = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "not yet implemented",
  });
};

exports.deleteIngredient = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "not yet implemented",
  });
};
