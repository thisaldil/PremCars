const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    seats: { type: Number, required: true },
    luggage: { type: Number, required: true },
    transmission: { type: String, required: true },
    fuelType: { type: String, required: true },
    features: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Car", carSchema);
