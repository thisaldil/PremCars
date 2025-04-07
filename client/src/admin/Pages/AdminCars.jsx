import React, { useEffect, useState } from "react";
import API from "../../api/axios";

const initialFormState = {
  name: "",
  category: "",
  image: "",
  pricePerDay: "",
  seats: "",
  luggage: "",
  transmission: "",
  fuelType: "",
  features: "",
};

const AdminCars = () => {
  const [cars, setCars] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [editingCarId, setEditingCarId] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const res = await API.get("/cars");
      setCars(res.data);
    } catch (err) {
      console.error("Failed to fetch cars", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.name) newErrors.name = "Car name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.image || !formData.image.startsWith("http"))
      newErrors.image = "Valid image URL is required";
    if (isNaN(parseFloat(formData.pricePerDay)))
      newErrors.pricePerDay = "Enter a valid number";
    if (isNaN(parseInt(formData.seats)))
      newErrors.seats = "Enter a valid number";
    if (isNaN(parseInt(formData.luggage)))
      newErrors.luggage = "Enter a valid number";
    if (!formData.transmission) newErrors.transmission = "Required";
    if (!formData.fuelType) newErrors.fuelType = "Required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const formattedData = {
      ...formData,
      pricePerDay: parseFloat(formData.pricePerDay),
      seats: parseInt(formData.seats),
      luggage: parseInt(formData.luggage),
      features: formData.features.split(",").map((f) => f.trim()),
    };

    try {
      if (editingCarId) {
        await API.put(`/cars/${editingCarId}`, formattedData);
      } else {
        await API.post("/cars", formattedData);
      }

      setFormData(initialFormState);
      setEditingCarId(null);
      setErrors({});
      fetchCars();
    } catch (err) {
      console.error("Failed to save car", err);
    }
  };

  const handleEdit = (car) => {
    setFormData({
      ...car,
      features: car.features.join(", "),
    });
    setEditingCarId(car._id);
  };

  const handleCancel = () => {
    setFormData(initialFormState);
    setEditingCarId(null);
    setErrors({});
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/cars/${id}`);
      fetchCars();
    } catch (err) {
      console.error("Failed to delete car", err);
    }
  };

  const renderInput = (name, placeholder, type = "text", helper = "") => (
    <div>
      <input
        name={name}
        placeholder={placeholder}
        value={formData[name]}
        onChange={handleChange}
        className="border p-2 rounded w-full"
        type={type}
      />
      {helper && <p className="text-xs text-gray-500 mt-1">{helper}</p>}
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">
        {editingCarId ? "Edit Car" : "Add New Car"}
      </h1>

      {/* Car Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded shadow"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {renderInput("name", "Car Name (e.g., Toyota Axio)")}
          <div>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            >
              <option value="">Select category</option>
              <option value="economy">Economy</option>
              <option value="compact">Compact</option>
              <option value="midsize">Midsize</option>
              <option value="suv">SUV</option>
              <option value="luxury">Luxury</option>
              <option value="van">Van</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Choose the car category
            </p>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>
          {renderInput("image", "Image URL", "text", "Must start with http")}
          {renderInput(
            "pricePerDay",
            "Price per day",
            "number",
            "Enter a number"
          )}
          {renderInput("seats", "Seats", "number", "Enter seat count")}
          {renderInput(
            "luggage",
            "Luggage",
            "number",
            "Enter luggage capacity"
          )}
          {renderInput("transmission", "Transmission (e.g., Automatic)")}
          {renderInput("fuelType", "Fuel Type (e.g., Petrol)")}
          {renderInput(
            "features",
            "Features (comma separated)",
            "text",
            "Example: Bluetooth, AC, USB"
          )}
        </div>

        <div className="flex items-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editingCarId ? "Update Car" : "Add Car"}
          </button>
          {editingCarId && (
            <button
              type="button"
              onClick={handleCancel}
              className="ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Car List */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Existing Cars</h2>

        {cars.length === 0 ? (
          <p className="text-center text-gray-500">No cars found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <div
                key={car._id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={car.image}
                  alt={car.name}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold">{car.name}</h3>
                    <p className="text-blue-600 font-semibold">
                      ${car.pricePerDay}
                      <span className="text-sm text-gray-500"> / day</span>
                    </p>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1">
                    <div>🚗 {car.seats} Seats</div>
                    <div>🧳 {car.luggage} Luggage</div>
                    <div>⚙️ {car.transmission}</div>
                    <div>⛽ {car.fuelType}</div>
                  </div>

                  {car.features?.length > 0 && (
                    <>
                      <p className="text-xs text-gray-500 mt-2">FEATURES</p>
                      <div className="flex flex-wrap gap-2 text-sm">
                        {car.features.map((feature, index) => (
                          <span
                            key={index}
                            className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs flex items-center gap-1"
                          >
                            <span>✔</span> {feature}
                          </span>
                        ))}
                      </div>
                    </>
                  )}

                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(car)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(car._id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCars;
