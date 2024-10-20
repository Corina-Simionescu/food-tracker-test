const User = require("../models/User.js");
const DailyFoodLog = require("../models/DailyFoodLog.js");
const moment = require("moment-timezone");

async function putNutritionPlan(req, res) {
  const userId = req.user.id;
  const { calories, proteins, fats, carbohydrates } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.nutritionPlan = {
      calories,
      proteins,
      fats,
      carbohydrates,
    };

    await user.save();

    res.status(201).json({ message: "Nutrition plan created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getNutritionPlan(req, res) {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.nutritionPlan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function putNewFood(req, res) {
  const userId = req.user.id;

  const {
    date,
    timezone,
    foodName,
    amount,
    unit,
    calories,
    proteins,
    carbohydrates,
    fats,
  } = req.body;

  const userDate = moment(date).tz(timezone);
  const startOfDay = userDate.clone().startOf("day");

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let foodLogEntry = await DailyFoodLog.findOne({
      user: userId,
      date: {
        $eq: startOfDay.format(),
      },
    });

    if (!foodLogEntry) {
      foodLogEntry = new DailyFoodLog({
        user: userId,
        date: startOfDay.format(),
        foods: [],
      });
    }

    foodLogEntry.foods.push({
      name: foodName,
      amount,
      unit,
      calories,
      proteins,
      carbohydrates,
      fats,
    });

    await foodLogEntry.save();

    res.status(200).json({ message: "Food added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function getFoodLog(req, res) {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const foodLog = await DailyFoodLog.find({ user: userId });

    res.status(200).json(foodLog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  putNutritionPlan,
  getNutritionPlan,
  putNewFood,
  getFoodLog,
};
