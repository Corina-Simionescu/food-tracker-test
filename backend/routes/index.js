const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.js");
const foodTrackerRoutes = require("./foodTracker.js");

router.use("/", authRoutes);
router.use("/food-tracker", foodTrackerRoutes);

module.exports = router;
