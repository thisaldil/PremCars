import React from "react";
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Emma Thompson",
      country: "United Kingdom",
      image:
        "https://th.bing.com/th/id/OIP.rIPUCsbBL-fiech4ZhbrTQHaKN?rs=1&pid=ImgDetMain",
      stars: 5,
      text: "PREM Car Rental made our Sri Lankan adventure perfect! The car was clean and well-maintained, and the driver was knowledgeable and friendly. Highly recommend for anyone visiting this beautiful island.",
    },
    {
      name: "Michael Chen",
      country: "Australia",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
      stars: 5,
      text: "We booked a van with a driver for our family trip around Sri Lanka. The service was exceptional, and our driver knew all the hidden gems. The vehicle was spacious and comfortable for our 10-day journey.",
    },
    {
      name: "Sarah Johnson",
      country: "Canada",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      stars: 4,
      text: "Great experience with PREM Car Rental. The online booking was simple, and the airport pickup was on time. The car was perfect for navigating both city traffic and countryside roads in Sri Lanka.",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Customer Testimonials</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear what our satisfied customers have to say about their experience
            with PREM Car Rental.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="h-14 w-14 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500">{testimonial.country}</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < testimonial.stars
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-600 italic">{testimonial.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
