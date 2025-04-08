const Driver = require("../models/Driver");

exports.getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch drivers", error: err });
  }
};

exports.addDriver = async (req, res) => {
  const { name, phone, licenseNumber } = req.body;
  try {
    const driver = new Driver({ name, phone, licenseNumber });
    await driver.save();
    res.status(201).json(driver);
  } catch (err) {
    res.status(400).json({ message: "Error adding driver", error: err });
  }
};

exports.updateDriver = async (req, res) => {
  try {
    const updated = await Driver.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Failed to update driver", error: err });
  }
};

exports.deleteDriver = async (req, res) => {
  try {
    await Driver.findByIdAndDelete(req.params.id);
    res.json({ message: "Driver removed" });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete driver", error: err });
  }
};
