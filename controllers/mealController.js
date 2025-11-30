const Meal = require("./../models/mealModel");
const AppError = require("./../Utils/appError");
const catchAsync = require("./../Utils/catchAsync");
const factory = require("./handlerFactory");
const {
  createAMeal,
  getMealWithIngredients,
  getAllMyMeals,
} = require("../services/mealService");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllMyMeals = catchAsync(async (req, res, next) => {
  const meals = await getAllMyMeals(req.user.id);

  res.status(200).json({
    status: "Success",
    data: {
      meals,
    },
  });
});

exports.createMeal = catchAsync(async (req, res, next) => {
  // add owner reference
  if (!req.body.owner) req.body.owner = req.user.id;
  const meal = await createAMeal(req.body);

  res.status(200).json({
    status: "Success",
    data: {
      meal,
    },
  });
});

exports.updateMeal = factory.updateOne(Meal);

exports.deleteMeal = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "not yet implemented",
  });
};
