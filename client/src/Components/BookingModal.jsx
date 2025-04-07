import React, { useState } from "react";
import { X } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import API from "../api/axios"; // Ensure path is correct

const BookingModal = ({ isOpen, onClose, carDetails, bookingDetails }) => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: userDetails.name,
      email: userDetails.email,
      phone: userDetails.phone,
      car: {
        id: carDetails._id,
        name: carDetails.name,
        pricePerDay: carDetails.pricePerDay,
        image: carDetails.image,
      },
      ...bookingDetails,
    };

    try {
      await API.post("/bookings", payload);

      alert(
        `${userDetails.name}, we will contact you soon with payment details. Have a nice day!`
      );

      // Reset state
      setUserDetails({ name: "", email: "", phone: "" });
      onClose();
    } catch (err) {
      console.error("Failed to submit booking", err);
      alert("Failed to submit booking. Please try again.");
    }
  };

  const handlePayClick = () => {
    alert("You will be redirected to the payment guide or gateway.");
  };

  const isFormValid =
    userDetails.name.trim() !== "" &&
    userDetails.phone.trim() !== "" &&
    userDetails.email.trim() !== "";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Ask for Availability</h2>

          {carDetails && (
            <div className="mb-4">
              <img
                src={carDetails.image}
                alt={carDetails.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={handlePayClick}
                  className="inline-flex items-center text-sm border border-blue-600 text-blue-600 font-medium px-3 py-1 rounded hover:bg-blue-50"
                >
                  💳 How to Pay
                </button>
              </div>
              <h3 className="text-xl font-semibold mt-4">{carDetails.name}</h3>
              <p className="text-blue-600 font-bold">
                ${carDetails.pricePerDay} / day
              </p>
            </div>
          )}

          {bookingDetails && (
            <div className="mb-6 space-y-2 text-sm">
              <p>
                <span className="font-semibold">Pick-up Date:</span>{" "}
                {bookingDetails.pickupDate}
              </p>
              <p>
                <span className="font-semibold">Drop-off Date:</span>{" "}
                {bookingDetails.dropoffDate}
              </p>
              <p>
                <span className="font-semibold">Driver:</span>{" "}
                {bookingDetails.withDriver ? "Yes" : "No"}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-center">
            <input
              type="text"
              placeholder="Your Name"
              value={userDetails.name}
              onChange={(e) =>
                setUserDetails({ ...userDetails, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="email"
              placeholder="Email Address"
              value={userDetails.email}
              onChange={(e) =>
                setUserDetails({ ...userDetails, email: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <PhoneInput
              country={"lk"}
              value={userDetails.phone}
              onChange={(phone) => setUserDetails({ ...userDetails, phone })}
              inputProps={{
                name: "phone",
                required: true,
              }}
              containerClass="w-full"
              inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full text-white font-medium py-2 px-4 rounded transition-colors ${
                isFormValid
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Confirm Booking
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
