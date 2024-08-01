const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const upload = require("../utils/multer");
const { MonthlyReport } = require("../models/monthlyReport");
const { Customer } = require("../models/customer");
const { cloudinary } = require("../utils/cloudinary");
const fs = require("fs");

router.post("/", auth, upload.single("report"), async (req, res) => {
  let customer = await Customer.findById(req.body.customerId);
  if (!customer)
    return res.status(404).send("The given customer id was not found");

  console.log(req.file);

  const { path, filename } = req.file;
  let uploadResponse;
  try {
    uploadResponse = await cloudinary.uploader.upload(path, {
      resource_type: "auto",
      public_id:
        `customer/${req.body.customerId}/` + "montlyreport_" + filename,
    });
    fs.unlinkSync(path);
  } catch (err) {
    return res.status(400).send("err" + err);
  }
  let monthlyReport = new MonthlyReport({
    report: uploadResponse.secure_url,
    customerId: req.body.customerId,
    month: req.body.month,
    year: req.body.year,
  });

  try {
    monthlyReport = await monthlyReport.save();
    customer.monthlyReport = [...customer.monthlyReport, monthlyReport._id];

    customer.save();

    res.status(200).send(monthlyReport);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/:id", auth, async (req, res) => {
  let monthlyReport = await MonthlyReport.find({ customerId: req.params.id });
  if (monthlyReport.length <= 0)
    return res.status(404).send("No reports found for this customer");

  res.status(200).send(monthlyReport);
});

module.exports = router;
