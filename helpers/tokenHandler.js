const jwt = require("jsonwebtoken");

function getToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY);
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
}

module.exports = {
  getToken,
  verifyToken,
};
