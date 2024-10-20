const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const { generateToken } = require("../config/jwt.js");

async function postSignUp(req, res) {
  const { username, password } = req.body;
  const existingUser = await User.findOne({ username });

  if (existingUser) {
    return res.status(400).json({ message: "Username already exists" });
  }

  const newUser = new User({ username, password });

  try {
    await newUser.save();
    const token = generateToken(newUser);
    res.status(201).json({ message: "User created successfully", token });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error creating the user: ${error.message}` });
  }
}

async function postSignIn(req, res) {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user);
      return res.status(200).json({ message: "Sign-in successfull", token });
    } else {
      res.status(401).json({ message: "Invalid credetials" });
    }
  } catch (error) {
    res.status(400).json({ message: `Error signing in ${error.message}` });
  }
}

function getProtected(req, res) {
  res.status(200).json({ user: req.user });
}

module.exports = {
  postSignUp,
  postSignIn,
  getProtected,
};
