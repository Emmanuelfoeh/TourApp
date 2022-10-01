const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
  name: {
    type: 'string',
    required: [true, 'A user name must be provided'],
    trim: true,
  },
  email: {
    type: 'string',
    required: [true, 'A user email must be provided'],
    lowercase: true,
    unique: true,
  },
  role: {
    type: 'String',
    enum: ['user', 'guide', 'lead-guide', 'admin'],
  },
  password: {
    type: 'string',
    select: false,
    required: [true, 'A user password'],
  },
  confirmPassword: {
    type: 'string',
    required: [true, 'A user confirmPassword'],
    validate: function (el) {
      return el === this.password;
    },
    message: 'The passwords does not match',
  },
  photos: { type: 'string' },
  //   passwordChangeAt: Date
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangeAt) {
    const changeTimeStamp = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10
    );
    return JWTTimeStamp < changeTimeStamp;
  }
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
