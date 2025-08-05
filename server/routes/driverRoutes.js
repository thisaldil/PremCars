const express = require("express");
const {
  getAllDrivers,
  addDriver,
  updateDriver,
  deleteDriver,
} = require("../controllers/driverController");

const router = express.Router();

router.get("/", getAllDrivers);
router.post("/", addDriver);
router.put("/:id", updateDriver);
router.delete("/:id", deleteDriver);

module.exports = router;
