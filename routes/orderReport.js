const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { OrderReport, validate } = require("../models/ordersReport");
const { Customer } = require("../models/customer");
const { cloudinary } = require("../utils/cloudinary");
const upload = require("../utils/multer");
const fs = require("fs");

router.post("/", auth, upload.single("invoice"), async (req, res) => {
  console.log(req.body);
  const { error, value } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  console.log("order report hit 2");
  let customer = await Customer.findById(req.body.customerId);
  if (!customer)
    return res.status(404).send("The given customer id was not found");

  console.log("order report hit 3");
  const { path, filename } = req.file;
  let uploadResponse;
  try {
    console.log("order report hit 4");
    uploadResponse = await cloudinary.uploader.upload(path, {
      public_id: `customer/${req.body.customerId}/` + "orderreport_" + filename,
    });
    fs.unlinkSync(path);
  } catch (err) {
    console.log("order report hit 5");
    res.status(400).send(err);
  }

  let allData = { ...req.body, invoice: uploadResponse.secure_url };

  let orderReport = new OrderReport(allData);

  try {
    orderReport = await orderReport.save();
    customer.orderReport = [...customer.orderReport, orderReport._id];
    console.log("order report hit 6");

    customer.save();
    res.status(200).send(orderReport);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/:id", auth, async (req, res) => {
  let orderReport = await OrderReport.findById(req.params.id);
  if (!orderReport)
    return res.status(404).send("The given report id was not found");
  console.log(req.body);
  orderReport.purchaseDate = req.body.purchaseDate;
  if (req.body.liveDate && req.body.liveDate instanceof Date) {
    orderReport.liveDate = req.body.liveDate;
  }
  orderReport.sales = req.body.sales;
  orderReport.profit = req.body.profit;
  orderReport.currentStock = req.body.currentStock;
  orderReport.totalStock = req.body.totalStock;
  orderReport.roi = req.body.roi;

  try {
    orderReport = await orderReport.save();

    res.status(200).send(orderReport);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/:id", auth, async (req, res) => {
  let orderReport = await OrderReport.find({ customerId: req.params.id });
  if (orderReport.length <= 0)
    return res.status(404).send("No reports found for this customer");

  res.status(200).send(orderReport);
});

module.exports = router;
