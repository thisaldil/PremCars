import React, { memo } from "react";
import { ChevronRight } from "lucide-react";

const Hero = ({ onBookNowClick }) => {
  const scrollToFleet = () => {
    document.getElementById("cars")?.scrollIntoView({
      behavior: "smooth",
    });
  };
  const scrollToBookNow = () => {
    document.getElementById("booking")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section className="relative bg-blue-700 text-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-90"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/620335/pexels-photo-620335.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
        }}
      ></div>
      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Explore Sri Lanka With Premium Cars
          </h1>
          <p className="text-xl mb-8">
            Book your travels across the island today! Comfortable, reliable
            cars with excellent service to make your journey memorable.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={scrollToBookNow}
              className="bg-white text-blue-700 hover:bg-gray-100 px-8 py-3 rounded-md font-medium flex items-center justify-center"
            >
              Book a Car <ChevronRight className="ml-2 h-5 w-5" />
            </button>
            <button
              onClick={scrollToFleet}
              className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-700 px-8 py-3 rounded-md font-medium transition-colors flex items-center justify-center"
            >
              View Our Fleet
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
