const { verifyToken } = require("../helpers/index.js");
const { User } = require("../models/index");

const authn = async (req, res, next) => {
  try {
    const { access_token } = req.headers;
    const payLoad = verifyToken(access_token);
    const foundUser = await User.findByPk(payLoad.id);
    req.headers.SERVER_KEY = process.env.SERVER_KEY;
    req.headers.AUTH_STRING = process.env.AUTH_STRING;
    req.user = {
      id: foundUser.id,
      username: foundUser.username,
      name: foundUser.name,
      balance: foundUser.balance,
      phoneNumber: foundUser.phoneNumber,
    };
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authn;
