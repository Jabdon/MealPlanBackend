const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

// signup
router.post("/signup", authController.signup);
router.post("/login", authController.login); //forgotPassword
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/ResetPassword/:token", authController.resetPassword);

router.use(authController.protect);

router.post("/updateMyPassword", authController.forgotPassword);

router.patch("/updateMe", userController.updateMe, userController.updateUser);

router.delete("/deleteMe", userController.deleteMe);

router.get("/me", userController.getMe, userController.getUser);

router.post("/logout", authController.logout);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
