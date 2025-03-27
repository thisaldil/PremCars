import React, { useState } from "react";
import { Users, Briefcase, Fuel, Gauge, CheckCircle } from "lucide-react";

const CarFleet = ({ onCarSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Cars" },
    { id: "economy", name: "Economy" },
    { id: "compact", name: "Compact" },
    { id: "midsize", name: "Midsize" },
    { id: "suv", name: "SUV" },
    { id: "luxury", name: "Luxury" },
    { id: "van", name: "Van" },
  ];

  const cars = [
    {
      id: 1,
      name: "Toyota Axio",
      category: "economy",
      image:
        "https://images.unsplash.com/photo-1590362891991-f776e747a588?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80",
      pricePerDay: 35,
      seats: 5,
      luggage: 2,
      transmission: "Automatic",
      fuelType: "Petrol",
      features: ["Air Conditioning", "Bluetooth", "USB Port"],
    },
    {
      id: 2,
      name: "Honda Vezel",
      category: "compact",
      image:
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      pricePerDay: 45,
      seats: 5,
      luggage: 3,
      transmission: "Automatic",
      fuelType: "Hybrid",
      features: [
        "Air Conditioning",
        "Bluetooth",
        "Reverse Camera",
        "Cruise Control",
      ],
    },
    {
      id: 3,
      name: "Toyota Prius",
      category: "midsize",
      image:
        "https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1528&q=80",
      pricePerDay: 50,
      seats: 5,
      luggage: 3,
      transmission: "Automatic",
      fuelType: "Hybrid",
      features: [
        "Air Conditioning",
        "Bluetooth",
        "USB Port",
        "Reverse Camera",
        "Cruise Control",
      ],
    },
    {
      id: 4,
      name: "Mitsubishi Montero",
      category: "suv",
      image:
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      pricePerDay: 80,
      seats: 7,
      luggage: 4,
      transmission: "Automatic",
      fuelType: "Diesel",
      features: [
        "Air Conditioning",
        "Bluetooth",
        "USB Port",
        "Reverse Camera",
        "Cruise Control",
        "4x4",
      ],
    },
    {
      id: 5,
      name: "Mercedes-Benz E-Class",
      category: "luxury",
      image:
        "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1015&q=80",
      pricePerDay: 120,
      seats: 5,
      luggage: 3,
      transmission: "Automatic",
      fuelType: "Petrol",
      features: [
        "Air Conditioning",
        "Leather Seats",
        "Bluetooth",
        "USB Port",
        "Reverse Camera",
        "Cruise Control",
        "GPS Navigation",
      ],
    },
    {
      id: 6,
      name: "Toyota HiAce",
      category: "van",
      image:
        "https://images.unsplash.com/photo-1609520505218-7421df0a5568?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80",
      pricePerDay: 90,
      seats: 9,
      luggage: 6,
      transmission: "Manual",
      fuelType: "Diesel",
      features: [
        "Air Conditioning",
        "Bluetooth",
        "USB Port",
        "Spacious Interior",
      ],
    },
  ];

  const filteredCars =
    selectedCategory === "all"
      ? cars
      : cars.filter((car) => car.category === selectedCategory);

  return (
    <section className="py-16 bg-gray-50" id="cars">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Our Fleet</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose from our wide range of well-maintained vehicles to suit your
            needs and budget.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === category.id
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map((car) => (
            <div
              key={car.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">{car.name}</h3>
                  <div className="text-blue-600 font-bold">
                    ${car.pricePerDay}{" "}
                    <span className="text-sm text-gray-500 font-normal">
                      / day
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-500 mr-2" />
                    <span>{car.seats} Seats</span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 text-gray-500 mr-2" />
                    <span>{car.luggage} Luggage</span>
                  </div>
                  <div className="flex items-center">
                    <Gauge className="h-5 w-5 text-gray-500 mr-2" />
                    <span>{car.transmission}</span>
                  </div>
                  <div className="flex items-center">
                    <Fuel className="h-5 w-5 text-gray-500 mr-2" />
                    <span>{car.fuelType}</span>
                  </div>
                </div>
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">
                    FEATURES
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {car.features.slice(0, 3).map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded"
                      >
                        <CheckCircle className="h-3 w-3 text-blue-600 mr-1" />
                        {feature}
                      </div>
                    ))}
                    {car.features.length > 3 && (
                      <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                        +{car.features.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => onCarSelect(car)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition-colors"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CarFleet;
