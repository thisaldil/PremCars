import React, { useState, useRef, useEffect } from "react";
import { Calendar, Clock, MapPin, User, Car } from "lucide-react";

// AddressAutocomplete component using Google Places API
const AddressAutocomplete = ({ label, name, value, onSelect, placeholder }) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (!window.google || !inputRef.current) return;

    // Initialize Google Places Autocomplete
    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["establishment", "geocode"],
        componentRestrictions: { country: "lk" }, // Restrict to Sri Lanka
        fields: ["place_id", "formatted_address", "name", "geometry"],
      }
    );

    // Handle place selection
    const handlePlaceSelect = () => {
      const place = autocompleteRef.current.getPlace();
      if (place && place.formatted_address) {
        onSelect(name, place.formatted_address, place);
      }
    };

    autocompleteRef.current.addListener("place_changed", handlePlaceSelect);

    // Cleanup
    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(
          autocompleteRef.current
        );
      }
    };
  }, [name, onSelect]);

  return (
    <div>
      <label className="block text-gray-700 font-medium mb-2">{label}</label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          ref={inputRef}
          type="text"
          name={name}
          value={value}
          onChange={(e) => onSelect(name, e.target.value)}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
    </div>
  );
};

const BookingForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    pickupDate: "",
    pickupTime: "",
    dropoffDate: "",
    dropoffTime: "",
    carType: "",
    withDriver: false,
  });

  const [placeDetails, setPlaceDetails] = useState({
    pickup: null,
    dropoff: null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleLocationSelect = (name, address, placeData = null) => {
    setFormData((prev) => ({
      ...prev,
      [name]: address,
    }));

    // Store place details for later use
    if (placeData) {
      const detailKey = name === "pickupLocation" ? "pickup" : "dropoff";
      setPlaceDetails((prev) => ({
        ...prev,
        [detailKey]: placeData,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Include place details in submission
    const submissionData = {
      ...formData,
      placeDetails,
    };

    onSubmit(submissionData);

    // Scroll to cars section if it exists
    document.getElementById("cars")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section className="py-12 bg-gray-50" id="booking">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Book Your Car</h2>
          <p className="text-gray-600">
            Find the perfect car for your Sri Lankan adventure
          </p>
        </div>
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AddressAutocomplete
                label="Pick-up Location"
                name="pickupLocation"
                value={formData.pickupLocation}
                onSelect={handleLocationSelect}
                placeholder="Enter pickup location in Sri Lanka"
              />
              <AddressAutocomplete
                label="Drop-off Location"
                name="dropoffLocation"
                value={formData.dropoffLocation}
                onSelect={handleLocationSelect}
                placeholder="Enter drop-off location in Sri Lanka"
              />
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Pick-up Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="date"
                    name="pickupDate"
                    value={formData.pickupDate}
                    onChange={handleChange}
                    min={
                      new Date(Date.now() + 86400000)
                        .toISOString()
                        .split("T")[0]
                    }
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Pick-up Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="time"
                    name="pickupTime"
                    value={formData.pickupTime}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Drop-off Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="date"
                    name="dropoffDate"
                    value={formData.dropoffDate}
                    onChange={handleChange}
                    min={formData.pickupDate || ""}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Drop-off Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="time"
                    name="dropoffTime"
                    value={formData.dropoffTime}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Car Type
                </label>
                <div className="relative">
                  <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <select
                    name="carType"
                    value={formData.carType}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                    required
                  >
                    <option value="">Select car type</option>
                    <option value="economy">Economy</option>
                    <option value="compact">Compact</option>
                    <option value="midsize">Midsize</option>
                    <option value="suv">SUV</option>
                    <option value="luxury">Luxury</option>
                    <option value="van">Van</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Driver Option
                </label>
                <div className="flex items-center mt-3">
                  <input
                    type="checkbox"
                    id="withDriver"
                    name="withDriver"
                    checked={formData.withDriver}
                    onChange={handleChange}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="withDriver"
                    className="ml-2 block text-gray-700"
                  >
                    With Driver (Recommended for tourists)
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium transition-colors"
              >
                Search Available Cars
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;
