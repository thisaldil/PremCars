import { useState } from "react";

const useBooking = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [bookingFormData, setBookingFormData] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    pickupDate: "",
    pickupTime: "",
    dropoffDate: "",
    dropoffTime: "",
    carType: "",
    withDriver: false,
  });

  const handleBookingSubmit = (data) => {
    setBookingFormData(data);
  };

  const handleCarSelect = (car) => {
    setSelectedCar(car);
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedCar(null);
  };

  return {
    isBookingModalOpen,
    selectedCar,
    bookingFormData,
    handleBookingSubmit,
    handleCarSelect,
    closeBookingModal,
  };
};

export default useBooking;
