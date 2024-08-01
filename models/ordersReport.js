const Joi = require("joi");
const jwt = require("jsonwebtoken");
Joi.ObjectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const config = require("config");

//OrderReport schema

const orderReportSchema = new mongoose.Schema(
  {
    value: { type: String, required: true },
    purchaseDate: { type: Date },
    liveDate: { type: Date },
    sales: { type: String },
    profit: { type: String },
    currentStock: { type: Number },
    totalStock: { type: Number },
    roi: { type: String },
    invoice: { type: String, required: true },
    invExpiryDate: { type: Date, required: true },
    customerId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Customer",
      required: true,
    },
  },
  { timestamps: true }
);

function validateOrder(order) {
  const schema = Joi.object({
    id: Joi.ObjectId(),
    value: Joi.string().required(),
    purchaseDate: Joi.date().allow("", null),
    liveDate: Joi.date().allow("", null),
    sales: Joi.string().allow("", null),
    profit: Joi.string().allow("", null),
    currentStock: Joi.string().allow("", null),
    totalStock: Joi.string().allow("", null),
    roi: Joi.string().allow("", null),
    invExpiryDate: Joi.date().required(),
    customerId: Joi.ObjectId().required(),
  });
  return schema.validate(order);
}

//OrderReport model

const OrderReport = mongoose.model("OrderReport", orderReportSchema);

exports.OrderReport = OrderReport;
exports.validate = validateOrder;
