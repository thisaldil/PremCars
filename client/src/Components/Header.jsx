import React, { useState } from "react";
import { Phone, Mail, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Car } from "lucide-react";
import carlogo from "../assets/photos/Removal-50.png";

const Header = ({ onBookNowClick, onOpenBankInfo }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
    });
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md  top-0 z-50">
      <div className="container mx-auto px-4 py-2">
        {/* Top Contact Info */}
        <div className="hidden md:flex justify-between items-center text-sm text-gray-600 border-b border-gray-100 pb-2">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-1" />
              <span>+94 76 983 0129</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-1" />
              <span>premcarsrenting@gmail.com</span>
            </div>
          </div>
          <div>
            <span>Galle, Sri Lanka</span>
          </div>
        </div>

        {/* Main Header */}
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <img
              src={carlogo}
              alt="Company Logo"
              className="h-10 mr-3" // Adjust the height and margin as needed
            />
            <h1 className="text-2xl font-bold text-blue-600">
              PREM <span className="text-gray-800">Car Rental</span>
            </h1>
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            <button
              onClick={() => scrollToSection("hero")}
              className="font-medium hover:text-blue-600 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("cars")}
              className="font-medium hover:text-blue-600 transition-colors"
            >
              Cars
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="font-medium hover:text-blue-600 transition-colors"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="font-medium hover:text-blue-600 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="font-medium hover:text-blue-600 transition-colors"
            >
              Contact
            </button>
            <button
              onClick={onOpenBankInfo}
              className="block font-medium hover:text-blue-600 transition-colors"
            >
              Paydetails
            </button>

            {/* Admin Login Button for Desktop */}
            <button
              onClick={() => navigate("/admin/login")}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Car className="h-6 w-6" />
            </button>
          </nav>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white px-4 pt-2 pb-4 shadow-lg">
          <nav>
            <ul className="flex flex-col space-y-4">
              <li>
                <button
                  onClick={() => scrollToSection("hero")}
                  className="block font-medium hover:text-blue-600 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("cars")}
                  className="block font-medium hover:text-blue-600 transition-colors"
                >
                  Cars
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("services")}
                  className="block font-medium hover:text-blue-600 transition-colors"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("about")}
                  className="block font-medium hover:text-blue-600 transition-colors"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="block font-medium hover:text-blue-600 transition-colors"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenBankInfo}
                  className="block font-medium hover:text-blue-600 transition-colors"
                >
                  Paydetails
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
