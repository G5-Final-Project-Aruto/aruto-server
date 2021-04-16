module.exports = (err, req, res, next) => {
  if (!err) {
    next();
  }

  let error = {
    status: 500,
    message: "Internal Server Error",
  };

  switch (err.name) {
    case "Invalid email / password":
      error = {
        ...error,
        status: 400,
        message: err.name,
      };
      break;
    default:
      break;
  }

  res.status(error.status).json({ message: error.message });
};
