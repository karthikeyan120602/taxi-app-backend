const express = require("express");

const router = express.Router();
const todos = require("./todos");
const drivers = require("./drivers");
const payment = require("./payment");
const rides = require("./rides");
const user = require("./user");

router.get("/", (_, res) => {
  res.json({
    message: "Welcome to API 🚀",
  });
});

router.use("/drivers", drivers);
router.use("/rides", rides);
router.use("/payment", payment);
router.use("/user", user);
module.exports = router;
