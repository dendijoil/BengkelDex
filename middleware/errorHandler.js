const handlingError = (err, req, res, next) => {
  let code = 500;
  let msg = "Internal server error";

  if (err.name === "SequelizeValidationError") {
    code = 400;
    msg = err.errors[0].message;
  } else if (err.name === "SequelizeUniqueConstraintError") {
    code = 400;
    msg = err.errors[0].message;
  } else if (err.name === "WrongPassword") {
    code = 401;
    msg = "Invalid username or password";
  } else if(err.name == 'JsonWebTokenError') {
    code = 401
    msg = 'invalid token'
  }

  res.status(code).json({
    statusCode: code,
    message: msg,
  });
};

module.exports = handlingError;
