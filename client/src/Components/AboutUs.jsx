import React from "react";
import { CheckCircle } from "lucide-react";

const AboutUs = () => {
  const features = [
    "Well-maintained, modern fleet of vehicles",
    "Experienced and professional drivers",
    "Comprehensive insurance coverage",
    "Flexible rental terms and durations",
    "No hidden fees or charges",
    "Customized tour packages available",
  ];

  return (
    <section className="py-16 bg-gray-50" id="about">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">About PREM Car Rental</h2>
            <p className="text-gray-600 mb-6">
              PREM Car Rental is a leading car rental service in Sri Lanka,
              dedicated to providing tourists with reliable, comfortable, and
              affordable transportation options. With years of experience in the
              tourism industry, we understand the unique needs of travelers
              exploring our beautiful island.
            </p>
            <p className="text-gray-600 mb-6">
              Our mission is to make your journey across Sri Lanka as seamless
              and enjoyable as possible. Whether you're visiting ancient
              cultural sites, relaxing on pristine beaches, or exploring lush
              tea plantations, we ensure you travel in comfort and style.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
              alt="Sri Lanka landscape with car"
              className="rounded-lg shadow-lg w-full h-auto object-cover"
            />
            <div className="absolute -bottom-6 -left-6 bg-blue-600 text-white p-6 rounded-lg shadow-lg max-w-xs hidden md:block">
              <p className="font-bold text-xl mb-2">10+ Years</p>
              <p>
                Of experience providing exceptional car rental services in Sri
                Lanka
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
