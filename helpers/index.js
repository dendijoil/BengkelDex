const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

function comparePassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

function generateToken(user) {
  return jwt.sign(user, "thisisarealshit");
}

function verifyToken(token) {
  return jwt.verify(token, "thisisarealshit");
}

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
};
