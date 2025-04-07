import React, { useEffect, useState } from "react";
import { Users, Briefcase, Fuel, Gauge, CheckCircle } from "lucide-react";
import API from "../api/axios"; // adjust the path if needed
const CarFleet = ({ onCarSelect, bookingData }) => {
  const [cars, setCars] = useState([]);
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

  useEffect(() => {
    fetchCars();
  }, []);

  useEffect(() => {
    if (bookingData?.carType) {
      setSelectedCategory(bookingData.carType);
    }
  }, [bookingData]);

  const fetchCars = async () => {
    try {
      const res = await API.get("/cars");
      setCars(res.data);
    } catch (err) {
      console.error("Failed to fetch cars", err);
    }
  };

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

        {/* Category Filters */}
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

        {/* Car Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              No cars found.
            </p>
          ) : (
            filteredCars.map((car) => (
              <div
                key={car._id}
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
                      ${car.pricePerDay}
                      <span className="text-sm text-gray-500 font-normal">
                        / day
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-700">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-gray-500 mr-2" />
                      {car.seats} Seats
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="h-5 w-5 text-gray-500 mr-2" />
                      {car.luggage} Luggage
                    </div>
                    <div className="flex items-center">
                      <Gauge className="h-5 w-5 text-gray-500 mr-2" />
                      {car.transmission}
                    </div>
                    <div className="flex items-center">
                      <Fuel className="h-5 w-5 text-gray-500 mr-2" />
                      {car.fuelType}
                    </div>
                  </div>

                  {/* Features */}
                  {car.features?.length > 0 && (
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
                  )}

                  <button
                    onClick={() => onCarSelect(car)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default CarFleet;
