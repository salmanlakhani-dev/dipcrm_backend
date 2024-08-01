const Joi = require("joi");
const jwt = require("jsonwebtoken");
Joi.ObjectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const config = require("config");

//user schema

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 3, maxlength: 1024 },
    role: { type: String, enum: ["admin", "employee"], default: "employee" },
    customerIds: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Customer",
      },
    ],
  },
  { timestamps: true }
);

//generating user authentication token

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this.id, type: "user", role: this.role },
    config.get("authTokenPrivateKey")
  );
  return token;
};

//user model

const User = mongoose.model("User", userSchema);

exports.User = User;
