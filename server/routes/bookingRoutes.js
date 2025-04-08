const express = require("express");
const router = express.Router();
const {
  createBooking,
  getAllBookings,
  updateBooking,
  deleteBooking, // ⬅️ New controller
} = require("../controllers/bookingController");

router.post("/", createBooking);
router.get("/", getAllBookings);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking); // ⬅️ Delete route added

module.exports = router;
