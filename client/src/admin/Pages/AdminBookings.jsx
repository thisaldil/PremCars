import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { Mail, Phone, CheckCircle, XCircle } from "lucide-react";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [editing, setEditing] = useState({});
  const [activeTab, setActiveTab] = useState("Pending");

  useEffect(() => {
    fetchBookings();
    fetchDrivers();
    autoFreeDrivers();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings");
      setBookings(res.data);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    }
  };

  const fetchDrivers = async () => {
    try {
      const res = await API.get("/drivers");
      setDrivers(res.data);
    } catch (err) {
      console.error("Failed to fetch drivers", err);
    }
  };
  const deleteCancelledBookings = async () => {
    try {
      const cancelled = bookings.filter((b) => b.status === "Cancelled");
      await Promise.all(cancelled.map((b) => API.delete(`/bookings/${b._id}`)));
      fetchBookings();
    } catch (err) {
      console.error("Failed to delete cancelled bookings", err);
    }
  };

  const autoFreeDrivers = async () => {
    try {
      const today = new Date();
      const res = await API.get("/bookings");
      const allBookings = res.data;

      const driverMap = {};

      allBookings.forEach((booking) => {
        if (
          booking.driver &&
          new Date(booking.dropoffDate) >= today &&
          new Date(booking.pickupDate) <= today
        ) {
          driverMap[booking.driver] = true;
        }
      });

      drivers.forEach(async (driver) => {
        const shouldBeBusy = driverMap[driver.name];
        const desiredStatus = shouldBeBusy ? "busy" : "free";
        if (driver.status !== desiredStatus) {
          await API.put(`/drivers/status/${driver.name}`, {
            status: desiredStatus,
          });
        }
      });
    } catch (err) {
      console.error("Failed to auto update driver statuses", err);
    }
  };

  const handleChange = (id, field, value) => {
    setEditing((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const calculateBill = (car, booking) => {
    const days =
      (new Date(booking.dropoffDate) - new Date(booking.pickupDate)) /
        (1000 * 60 * 60 * 24) +
      1;

    let rate = car.pricePerDay;
    let rateNote = `Base Rate: LKR ${car.pricePerDay}`;

    if (booking.withDriver) {
      if (car.pricePerDay < 45) rate = 10000;
      else if (car.pricePerDay < 70) rate = 18000;
      else rate = 25000;
      rateNote = `With Driver: LKR ${rate} per day`;
    }

    return {
      days,
      rate,
      total: rate * days,
      note: rateNote,
    };
  };

  const isDateOverlap = (start1, end1, start2, end2) => {
    return (
      new Date(start1) <= new Date(end2) && new Date(end1) >= new Date(start2)
    );
  };

  const isDriverAvailable = (driverName, currentBooking) => {
    return !bookings.some((booking) => {
      return (
        booking.driver === driverName &&
        booking._id !== currentBooking._id &&
        isDateOverlap(
          currentBooking.pickupDate,
          currentBooking.dropoffDate,
          booking.pickupDate,
          booking.dropoffDate
        )
      );
    });
  };

  const updateBooking = async (id) => {
    try {
      const data = editing[id];
      await API.put(`/bookings/${id}`, data);

      if (data.driver) {
        const today = new Date().toISOString().split("T")[0];
        const booking = bookings.find((b) => b._id === id);
        if (
          new Date(today) >= new Date(booking.pickupDate) &&
          new Date(today) <= new Date(booking.dropoffDate)
        ) {
          await API.put(`/drivers/status/${data.driver}`, { status: "busy" });
        }
      }

      setEditing((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      fetchBookings();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const generateWhatsAppLink = (phone, name, car, bill) => {
    const message = `Hi ${name}, your booking for the ${
      car.name
    } is confirmed.\nTotal Bill: LKR ${bill.total.toLocaleString()} (${
      bill.days
    } days × ${bill.rate}).\nThank you!`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  const generateEmailLink = (email, name, car, bill) => {
    const subject = `Booking Confirmation for ${car.name}`;
    const body = `Hi ${name},\n\nYour booking for the ${
      car.name
    } is confirmed.\n\nDetails:\n- Duration: ${
      bill.days
    } days\n- Daily Rate: LKR ${
      bill.rate
    }\n- Total: LKR ${bill.total.toLocaleString()}\n\nThank you for choosing us!`;
    return `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const tabs = ["Pending", "Confirmed", "Cancelled"];

  const filteredBookings = bookings.filter(
    (booking) => (booking.status || "Pending") === activeTab
  );

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">All Bookings</h1>

      <div className="flex space-x-4 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${
              activeTab === tab
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
        {activeTab === "Cancelled" && (
          <button
            onClick={deleteCancelledBookings}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded"
          >
            Remove Cancelled
          </button>
        )}
      </div>

      {filteredBookings.length === 0 ? (
        <p className="text-gray-600">No bookings found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBookings.map((booking) => {
            const bill = calculateBill(booking.car, booking);
            const edit = editing[booking._id] || {};

            return (
              <div
                key={booking._id}
                className="bg-white p-4 rounded-lg shadow-md space-y-2"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">
                    {booking.car.name} (
                    {booking.withDriver ? "With Driver" : "No Driver"})
                  </h2>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      booking.status === "Confirmed"
                        ? "bg-green-100 text-green-800"
                        : booking.status === "Cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {booking.status || "Pending"}
                  </span>
                </div>

                <img
                  src={booking.car.image}
                  alt={booking.car.name}
                  className="h-32 w-full object-cover rounded"
                />

                <div className="text-sm text-gray-700 space-y-1">
                  <p>
                    📍 {booking.pickupLocation} → {booking.dropoffLocation}
                  </p>
                  <p>
                    🗓 {booking.pickupDate} to {booking.dropoffDate}
                  </p>
                  <p>
                    📅 Applied: {new Date(booking.appliedDate).toDateString()}
                  </p>
                  <p>💰 Total Bill: LKR {bill.total.toLocaleString()}</p>
                  <p className="text-gray-500 text-xs">
                    {bill.note} × {bill.days} days
                  </p>
                </div>

                <div className="text-sm text-gray-600 mt-2">
                  <p>
                    <strong>Client:</strong> {booking.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {booking.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {booking.phone}
                  </p>
                </div>

                <div className="flex gap-2 mt-3">
                  <a
                    href={generateEmailLink(
                      booking.email,
                      booking.name,
                      booking.car,
                      bill
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded text-center"
                  >
                    ✉️ Email
                  </a>
                  <a
                    href={generateWhatsAppLink(
                      booking.phone,
                      booking.name,
                      booking.car,
                      bill
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded text-center"
                  >
                    💬 WhatsApp
                  </a>
                </div>

                <div className="flex flex-col gap-2 mt-4">
                  <select
                    value={edit.status || booking.status || ""}
                    onChange={(e) =>
                      handleChange(booking._id, "status", e.target.value)
                    }
                    className="border rounded px-2 py-1"
                  >
                    <option value="">Update Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  <select
                    value={edit.driver || booking.driver || ""}
                    onChange={(e) =>
                      handleChange(booking._id, "driver", e.target.value)
                    }
                    className="border px-2 py-1 rounded"
                  >
                    <option value="">Assign Driver</option>
                    {drivers.map((driver) => (
                      <option
                        key={driver.name}
                        value={driver.name}
                        disabled={!isDriverAvailable(driver.name, booking)}
                      >
                        {driver.name} ({driver.status})
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => updateBooking(booking._id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Update Booking
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
