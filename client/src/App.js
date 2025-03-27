import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext"; // Import auth context

// User Components
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

// Admin Components
import AdminLayout from "./admin/components/AdminLayout";
import AdminDashboard from "./admin/Pages/AdminDashboard.jsx";
import AdminLogin from "./admin/Pages/AdminLogin.jsx";

// ✅ Protected Route Component
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
      {" "}
      {/* ✅ Wrap everything inside AuthProvider */}
      <Router>
        <div className="flex flex-col min-h-screen bg-white">
          <Routes>
            {/* ✅ Admin Routes (Protected) */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* ✅ User Routes */}
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <main className="flex-grow">
                    <Hero />
                    <BookingForm onSubmit={handleBookingSubmit} />
                    <Services />
                    <CarFleet onCarSelect={handleCarSelect} />
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
