const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { auth, authAdmin } = require("../middleware/auth");
const { Customer } = require("../models/customer");
const { User } = require("../models/user");

// getting by auth code

router.get("/me", auth, async (req, res) => {
  if (req.auth.type == "customer") {
    const customer = await Customer.findById(req.auth._id)
      .select("-password")
      .populate("orderReport")
      .populate("monthlyReport");

    if (!customer) return res.status(404).send("The given id was not found");

    res.send(customer);
  } else {
    const user = await User.findById(req.auth._id)
      .select("-password")
      .populate({
        path: "customerIds",
      });

    if (!user) return res.status(404).send("The given id was not found");

    res.send(user);
  }
});

router.post("/login/user", async (req, res) => {
  const { error, value } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: value.email });
  if (!user) return res.status(400).send("Invalid User or Password");

  const passwordValid = await bcrypt.compare(value.password, user.password);
  if (!passwordValid) return res.status(400).send("Invalid User or Password");

  const token = user.generateAuthToken();

  res.send(token);
});

router.post("/login/customer", async (req, res) => {
  const { error, value } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = await Customer.findOne({ email: value.email });
  if (!customer) return res.status(400).send("Invalid User or Password");

  const passwordValid = await bcrypt.compare(value.password, customer.password);
  if (!passwordValid) return res.status(400).send("Invalid User or Password");

  const token = customer.generateAuthToken();

  res.send(token);
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(255).required(),
  });
  return schema.validate(req);
}

module.exports = router;
