const jwt = require("jsonwebtoken");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

function generateToken(user) {
  return jwt.sign({ id: user._id, username: user.username }, JWT_SECRET_KEY, {
    expiresIn: "2h",
  });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET_KEY);
}

module.exports = {
  generateToken,
  verifyToken,
};
