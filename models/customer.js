const Joi = require("joi");
const jwt = require("jsonwebtoken");
Joi.ObjectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const config = require("config");

//customer schema

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 3, maxlength: 1024 },
    orderReport: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "OrderReport",
      },
    ],
    monthlyReport: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "MontyReport",
      },
    ],
  },
  { timestamps: true }
);

//generating customer authentication token

customerSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this.id, type: "customer" },
    config.get("authTokenPrivateKey")
  );
  return token;
};

//customer model

const Customer = mongoose.model("Customer", customerSchema);

exports.Customer = Customer;
