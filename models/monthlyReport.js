const Joi = require("joi");
const jwt = require("jsonwebtoken");
Joi.ObjectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const config = require("config");

//MonthyReport schema

const monthlyReportSchema = new mongoose.Schema(
  {
    report: { type: String, required: true },
    month: { type: String, required: true },
    year: { type: String, required: true },
    customerId: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Customer",
      },
    ],
  },
  { timestamps: true }
);

//MonthyReport model

const MonthlyReport = mongoose.model("MontyReport", monthlyReportSchema);

exports.MonthlyReport = MonthlyReport;
