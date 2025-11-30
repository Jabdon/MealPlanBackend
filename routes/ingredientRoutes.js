const express = require("express");
const authController = require("../controllers/authController");
const ingredientController = require("../controllers/ingredientController");

const router = express.Router();

router.route("/search").get(ingredientController.searchIngredients);

router.route("/").post(ingredientController.getIngredientNutrients);

router.use(authController.protect);

router
  .route("/:id")
  .get(ingredientController.getIngredientNutrients)
  .delete(ingredientController.deleteIngredient);

module.exports = router;
