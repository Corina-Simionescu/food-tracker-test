const { verifyToken } = require("../config/jwt.js");

function verifyAuthToken(req, res, next) {
  const authorizationHeader = req.header("Authorization");
  const token = authorizationHeader
    ? authorizationHeader.replace("Bearer ", "")
    : undefined;

  if (!token) {
    return res.status(401).json({ message: "Token doesn't exist" });
  }

  try {
    const JWTPayloadDecoded = verifyToken(token);
    req.user = JWTPayloadDecoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
}

module.exports = {
  verifyAuthToken,
};
