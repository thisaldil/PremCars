import React from "react";
import {
  DollarSign,
  ListIcon,
  UserIcon,
  GlobeIcon,
  PlaneIcon,
} from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: <DollarSign className="h-10 w-10 text-blue-600" />,
      title: "Best Prices",
      description:
        "We offer competitive rates and special discounts for long-term rentals to ensure you get the best value.",
    },
    {
      icon: <GlobeIcon className="h-10 w-10 text-blue-600" />,
      title: "24/7 Support",
      description:
        "Our customer support team is available around the clock to assist you with any queries or emergencies.",
    },
    {
      icon: <ListIcon className="h-10 w-10 text-blue-600" />,
      title: "Lot Of Choices",
      description:
        "From compact cars to luxury vehicles and vans, we have a diverse fleet to match your specific needs.",
    },
    {
      icon: <UserIcon className="h-10 w-10 text-blue-600" />,
      title: "With Driver",
      description:
        "Opt for our experienced local drivers who know the best routes and can serve as informal guides.",
    },
    {
      icon: <GlobeIcon className="h-10 w-10 text-blue-600" />,
      title: "Online Services",
      description:
        "Book, modify, or cancel your reservation online with our user-friendly platform, anytime, anywhere.",
    },
    {
      icon: <PlaneIcon className="h-10 w-10 text-blue-600" />,
      title: "Airport Pickups",
      description:
        "Start your journey smoothly with our convenient airport pickup service available at all Sri Lankan airports.",
    },
  ];

  return (
    <section className="py-16 bg-white" id="services">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Our Premium Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience the best car rental service in Sri Lanka with our
            comprehensive range of premium offerings tailored to make your
            journey comfortable and hassle-free.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
