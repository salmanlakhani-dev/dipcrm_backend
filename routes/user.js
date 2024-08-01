const express = require("express");
const router = express.Router();
const { auth, authAdmin } = require("../middleware/auth");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");

router.post("/", authAdmin, async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User Already Registered");

  user = new User(req.body);

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  try {
    user = await user.save();

    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/getallusers", authAdmin, async (req, res) => {
  let users = await User.find();

  res.send(users);
});

router.post("/changepassword", auth, async (req, res) => {
  let user = await User.findById(req.auth._id);
  if (!user) return res.status(404).send("The given id was not found");

  const passwordValid = await bcrypt.compare(
    req.currentPassword,
    user.password
  );
  if (!passwordValid) return res.status(400).send("Invalid User or Password");

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.newPassword, salt);

  try {
    const token = user.generateAuthToken();

    user = await user.save();

    res.status(200).header("authtoken", token).send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/:id", auth, async (req, res) => {
  let user = await User.findById(req.params.id);
  if (!user) return res.status(404).send("The given user id was not found");

  if (req.body.password != null || req.body.password != "") {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
  }

  user.name = req.body.name;
  user.email = req.body.email;
  user.role = req.body.role;

  try {
    user = await user.save();

    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
