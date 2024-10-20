const mongoose = require("mongoose");

const dailyFoodLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true },
  foods: [
    {
      name: { type: String, required: true },
      amount: { type: Number, required: true },
      unit: { type: String, required: true },
      calories: { type: Number, required: true },
      proteins: { type: Number, required: true },
      carbohydrates: { type: Number, required: true },
      fats: { type: Number, required: true },
    },
  ],
});

const DailyFoodLog = mongoose.model("DailyFoodLog", dailyFoodLogSchema);

module.exports = DailyFoodLog;
