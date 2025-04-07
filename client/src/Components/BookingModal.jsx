import React, { useState } from "react";
import { X } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import API from "../api/axios";

const BookingModal = ({
  isOpen,
  onClose,
  carDetails,
  bookingDetails,
  onOpenBankInfo,
}) => {
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
        `${userDetails.name}, we will contact you soon with payment details.`
      );
      setUserDetails({ name: "", email: "", phone: "" });
      onClose();
    } catch (err) {
      console.error("Failed to submit booking", err);
      alert("Failed to submit booking. Please try again.");
    }
  };

  const isFormValid =
    userDetails.name.trim() &&
    userDetails.email.trim() &&
    userDetails.phone.trim();

  if (!isOpen) return null;

  return (
    <>
      {/* Booking Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-md w-full relative z-50">
          <button
            onClick={onClose}
            className="bg-white text-gray-600 hover:text-red-500 border border-gray-200 shadow-md rounded-full p-2 z-50"
          >
            <X className="w-5 h-5" />
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
                    onClick={() => onOpenBankInfo()}
                    className="inline-flex items-center text-sm border border-blue-600 text-blue-600 font-medium px-3 py-1 rounded hover:bg-blue-50"
                  >
                    💳 How to Pay
                  </button>
                </div>
                <h3 className="text-xl font-semibold mt-4">
                  {carDetails.name}
                </h3>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                value={userDetails.email}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <PhoneInput
                country={"lk"}
                value={userDetails.phone}
                onChange={(phone) => setUserDetails({ ...userDetails, phone })}
                inputProps={{ required: true }}
                containerClass="w-full"
                inputClass="w-full px-3 py-2 border border-gray-300 rounded-md"
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

      {/* BankInfo Modal rendered separately and above everything */}
    </>
  );
};

export default BookingModal;
