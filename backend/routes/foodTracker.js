const express = require("express");
const router = express.Router();
const foodTrackerController = require("../controllers/foodTracker.js");
const authMiddleware = require("../middleware/auth.js");

router.put(
  "/nutrition",
  authMiddleware.verifyAuthToken,
  foodTrackerController.putNutritionPlan
);
router.get(
  "/nutrition/",
  authMiddleware.verifyAuthToken,
  foodTrackerController.getNutritionPlan
);
router.put(
  "/food",
  authMiddleware.verifyAuthToken,
  foodTrackerController.putNewFood
);
router.get(
  "/food",
  authMiddleware.verifyAuthToken,
  foodTrackerController.getFoodLog
);

module.exports = router;
