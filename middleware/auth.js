const config = require("config");
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  console.log("auth middleware working");
  const token = req.header("authtoken");
  if (!token)
    return res.status(401).send("Access Denied. You are not authorized.");

  try {
    const decoded = jwt.verify(token, config.get("authTokenPrivateKey"));
    req.auth = decoded;
    console.log("auth middleware verified");
    next();
  } catch (ex) {
    console.log("auth middleware invalid token");
    res.status(400).send(`Invalid Token. ${ex}`);
  }
}

function authAdmin(req, res, next) {
  console.log("authAdmin middleware working");
  const token = req.header("authtoken");
  if (!token)
    return res.status(401).send("Access Denied. You are not authorized.");

  try {
    const decoded = jwt.verify(token, config.get("authTokenPrivateKey"));
    if (decoded.role === "admin") {
      req.auth = decoded;
      console.log("authAdmin middleware verified");
      next();
    } else {
      res.status(403).send("Access Denied");
    }
  } catch (ex) {
    console.log("authAdmin middleware invalid token");
    res.status(400).send(`Invalid Token. ${ex}`);
  }
}

module.exports = { auth, authAdmin };
