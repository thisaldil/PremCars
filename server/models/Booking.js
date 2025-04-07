const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    car: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "Car" },
      name: String,
      pricePerDay: Number,
      image: String,
    },
    pickupLocation: String,
    dropoffLocation: String,
    pickupDate: String,
    pickupTime: String,
    dropoffDate: String,
    dropoffTime: String,
    withDriver: Boolean,

    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Confirmed", "Cancelled"],
    },

    driver: { type: String },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
