const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// create the schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    maxlength: [55, "user first name should be less or equal to 55"],
  },
  lastName: {
    type: String,
    required: true,
    maxlength: [55, "user last name should be less or equal to 55"],
  },
  email: {
    type: String,
    required: [true, "you must have an email"],
    maxlength: [55, "email should be less or equal to 55"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [8, "Your password cannot be less than 8"],
    select: false,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [8, "Your password cannot be less than 8"],
    validate: {
      // this only works on CREATE & SAVE
      validator: function (el) {
        return el === this.password;
      },
      message: "Password are not the same",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  // set passwordConfirm to undefined so that it does not persist
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000; // substract by 1 second in case token is created before we update passwordChangedAt
});

userSchema.pre(/^find/, function (next) {
  // ensure it returns active users
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    // convert time to timestamp
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // in 10 minutes

  return resetToken;
};

// create the model
const User = mongoose.model("User", userSchema);

module.exports = User;
