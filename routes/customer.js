const express = require("express");
const router = express.Router();
const { auth, authAdmin } = require("../middleware/auth");
const bcrypt = require("bcrypt");
const { Customer } = require("../models/customer");
const { User } = require("../models/user");

router.post("/", authAdmin, async (req, res) => {
  let customer = await Customer.findOne({ email: req.body.email });
  if (customer) return res.status(400).send("User Already Registered");

  customer = new Customer(req.body);

  let user = await User.findById(req.body.userId);

  const salt = await bcrypt.genSalt(10);
  customer.password = await bcrypt.hash(customer.password, salt);

  try {
    customer = await customer.save();
    user.customerIds = [...user.customerIds, customer._id];
    user.save();
    res.status(200).send(customer);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/getallcustomers", authAdmin, async (req, res) => {
  let customers = await Customer.find();

  res.send(customers);
});

router.post("/changepassword", auth, async (req, res) => {
  let customer = await Customer.findById(req.auth._id);
  if (!customer) return res.status(404).send("The given id was not found");

  const passwordValid = await bcrypt.compare(
    req.currentPassword,
    customer.password
  );
  if (!passwordValid) return res.status(400).send("Invalid User or Password");

  const salt = await bcrypt.genSalt(10);
  customer.password = await bcrypt.hash(req.newPassword, salt);

  try {
    const token = customer.generateAuthToken();

    customer = await customer.save();

    res.status(200).header("authtoken", token).send(customer);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
