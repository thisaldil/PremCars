import React from "react";
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
import Footer from "./Components/Footer.jsx";
import BookingModal from "./Components/BookingModal";
import UseBooking from "./Hooks/UseBooking";

import AdminLayout from "./admin/components/AdminLayout";
import AdminDashboard from "./admin/Pages/AdminDashboard.jsx";
import AdminLogin from "./admin/Pages/AdminLogin.jsx";
import AdminCars from "./admin/Pages/AdminCars.jsx";
import AdminBookings from "./admin/Pages/AdminBookings.jsx";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

function App() {
  const {
    isBookingModalOpen,
    selectedCar,
    bookingFormData,
    handleBookingSubmit,
    handleCarSelect,
    closeBookingModal,
  } = UseBooking();

  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-white">
          <Routes>
            {/* Admin Login */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin Routes */}
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
              {/* Add more admin pages like below */}
              {/* <Route path="bookings" element={<BookingsPage />} /> */}
            </Route>

            {/* User-facing routes */}
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <main className="flex-grow">
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
                    <BookingModal
                      isOpen={isBookingModalOpen}
                      onClose={closeBookingModal}
                      carDetails={selectedCar}
                      bookingDetails={bookingFormData}
                    />
                  </main>
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
