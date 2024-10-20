const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  nutritionPlan: {
    calories: {
      type: String,
      default: "0",
    },
    proteins: {
      type: String,
      default: "0",
    },
    fats: {
      type: String,
      default: "0",
    },
    carbohydrates: {
      type: String,
      default: "0",
    },
  },
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
