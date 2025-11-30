const express = require("express");
const authController = require("../controllers/authController");
const mealController = require("../controllers/mealController");

const router = express.Router();

router.use(authController.protect);

router
  .route("/")
  .get(mealController.getAllMyMeals) // getAllMyMeals
  .post(mealController.createMeal);

router
  .route("/:id")
  .patch(mealController.updateMeal)
  .delete(mealController.deleteMeal);

module.exports = router;
