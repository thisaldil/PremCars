import React from "react";
import { X } from "lucide-react";

const BookingModal = ({ isOpen, onClose, carDetails, bookingDetails }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the payment processing
    // For now, we'll just show a success message
    alert("Booking successful! We will contact you shortly.");
    onClose();
  };

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
          <h2 className="text-2xl font-bold mb-4">Confirm Booking</h2>
          {carDetails && (
            <div className="mb-6">
              <img
                src={carDetails.image}
                alt={carDetails.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold">{carDetails.name}</h3>
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVC
                </label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
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
