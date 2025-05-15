import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Header from "./Components/Header";
import Hero from "./Components/Hero";
import BookingForm from "./Components/BookingForm";
import Services from "./Components/Services";
import CarFleet from "./Components/CarFleet";
import Testimonials from "./Components/Testimonials";
import AboutUs from "./Components/AboutUs";
import Contact from "./Components/Contact";
import Footer from "./Components/Footer";
import BookingModal from "./Components/BookingModal";
import BankInfoModal from "./Components/BankInfoModal.jsx";
import UseBooking from "./Hooks/UseBooking";

import AdminLayout from "./admin/components/AdminLayout";
import AdminDashboard from "./admin/Pages/AdminDashboard";
import AdminLogin from "./admin/Pages/AdminLogin";
import AdminCars from "./admin/Pages/AdminCars";
import AdminBookings from "./admin/Pages/AdminBookings";
import AdminDrivers from "./admin/Pages/AdminDrivers";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  const {
    isBookingModalOpen,
    setIsBookingModalOpen,
    selectedCar,
    bookingFormData,
    handleBookingSubmit,
    handleCarSelect,
    closeBookingModal,
  } = UseBooking();

  const [isBankInfoOpen, setIsBankInfoOpen] = useState(false);
  const handleBankInfoClose = () => {
    setIsBankInfoOpen(false);
    setIsBookingModalOpen(true);
  };
  const openBankInfoModal = () => {
    setIsBankInfoOpen(true);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-white relative">
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />

            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="cars" element={<AdminCars />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="drivers" element={<AdminDrivers />} />
            </Route>

            <Route
              path="/"
              element={
                <>
                  <Header onOpenBankInfo={openBankInfoModal} />

                  <main className="flex-grow relative z-0">
                    <Hero />
                    <BookingForm onSubmit={handleBookingSubmit} />
                    <Services />
                    <CarFleet
                      onCarSelect={handleCarSelect}
                      bookingData={bookingFormData}
                    />
                    <Testimonials />
                    <AboutUs />
                    <Contact />
                  </main>

                  <div className="relative z-[100]">
                    {isBookingModalOpen && !isBankInfoOpen && (
                      <div className="fixed inset-0 z-[9999] bg-black bg-opacity-60 overflow-y-auto">
                        <div className="flex justify-center px-4 mt-24 mb-10">
                          <BookingModal
                            isOpen={isBookingModalOpen}
                            onClose={closeBookingModal}
                            carDetails={selectedCar}
                            bookingDetails={bookingFormData}
                            onOpenBankInfo={() => setIsBankInfoOpen(true)}
                            setIsBookingModalOpen={setIsBookingModalOpen} // ✅ MUST be passed if used inside
                          />
                        </div>
                      </div>
                    )}

                    {isBankInfoOpen && (
                      <div className="fixed inset-0 z-[9999] bg-black bg-opacity-60 overflow-y-auto">
                        <div className="flex justify-center px-4 mt-24 mb-10">
                          <BankInfoModal
                            isOpen={true}
                            onClose={() => {
                              setIsBankInfoOpen(false);
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <Footer />
                </>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
