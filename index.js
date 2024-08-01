const mongoose = require("mongoose");
const config = require("config");
const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

const auth = require("./routes/auth");
const user = require("./routes/user");
const customer = require("./routes/customer");
const monthlyReport = require("./routes/monthlyReport");
const orderReport = require("./routes/orderReport");

if (!config.get("authTokenPrivateKey")) {
  console.error("FATAL ERROR: AuthKey not defined");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODBURL)
  .then(() => {
    console.log("Connected to MongoDB...");
  })
  .catch((err) => console.error("Could Not Connect ", err));

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static("public"));
app.use("/api/auth", auth);
app.use("/api/monthlyReport", monthlyReport);
app.use("/api/orderReport", orderReport);
app.use("/api/customer", customer);
app.use("/api/user", user);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to port ${port} ...`));
