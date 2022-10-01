const { catchAsync } = require('../utils/catchAsync');
const User = require('./../Models/userModel');
const AppError = require('./../utils/appError');




// get all users
exports.getAllUsers = catchAsync( async (req, res,next) => {
const users = await User.find()
  res.status(200).json({
    status: 'success',
    length:users.length,
    data:{
      users
    }
  });
});



exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet created',
  });
};
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet created',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet created',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet created',
  });
};
