const User = require("./../models/userModel");
const AppError = require("./../Utils/appError");
const catchAsync = require("./../Utils/catchAsync");
const factory = require("./handlerFactory");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "Success",
    data: {
      users,
    },
  });
});
exports.getUser = factory.getOne(User);

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "not yet implemented",
  });
};

exports.updateUser = factory.updateOne(User);

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "not yet implemented",
  });
};
exports.getMe = (req, res, next) => {
  //setting req.params.id to user.id
  req.params.id = req.user.id;
  next();
};

exports.updateMe = (req, res, next) => {
  //setting req.params.id to user.id
  req.params.id = req.user.id;
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("Can't update password in this request", 400));
  }

  // filtered out un
  const filteredBody = filterObj(req.body, "firstName", "lastName");
  req.body = filteredBody;

  next();
};

exports.deleteMe = catchAsync(async (req, res, next) => {
  const updateUser = await User.findByIdAndUpdate(req.user.id, {
    active: false,
  });

  res.status(204).json({});
});
