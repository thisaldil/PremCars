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
                className="group relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 transition-all duration-500 hover:shadow-3xl hover:shadow-blue-500/20 hover:scale-[1.02] hover:border-blue-500/30"
              >
                {/* Premium Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Racing Stripes */}
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-cyan-500"></div>

                <div className="relative p-6 space-y-5">
                  {/* Header Section */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold text-white leading-tight">
                        {booking.car.name}
                      </h2>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-sm text-blue-400 font-medium">
                          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                          {booking.withDriver
                            ? "🏎️ Chauffeur Service"
                            : "🔑 Self Drive"}
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase backdrop-blur-sm border ${
                          booking.status === "Confirmed"
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 shadow-emerald-500/20"
                            : booking.status === "Cancelled"
                            ? "bg-red-500/20 text-red-300 border-red-500/30 shadow-red-500/20"
                            : "bg-amber-500/20 text-amber-300 border-amber-500/30 shadow-amber-500/20"
                        } shadow-lg`}
                      >
                        {booking.status || "Pending"}
                      </span>
                    </div>
                  </div>

                  {/* Vehicle Image */}
                  <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600/30">
                    <img
                      src={booking.car.image}
                      alt={booking.car.name}
                      className="h-32 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-2 right-2 bg-black/40 backdrop-blur-sm rounded-lg px-2 py-1">
                      <span className="text-xs text-white font-medium">
                        Premium Fleet
                      </span>
                    </div>
                  </div>

                  {/* Trip Details */}
                  <div className="space-y-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3 text-slate-300">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-500/20 rounded-full">
                        <span className="text-sm">📍</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">
                          {booking.pickupLocation}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-6 border-t border-dashed border-slate-600"></div>
                          <span className="text-xs text-slate-400">to</span>
                          <div className="w-6 border-t border-dashed border-slate-600"></div>
                        </div>
                        <p className="text-sm font-medium text-blue-400">
                          {booking.dropoffLocation}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <span className="text-blue-400">🗓</span>
                        <div>
                          <p className="text-xs text-slate-400">Duration</p>
                          <p className="text-sm font-medium text-white">
                            {booking.pickupDate}
                          </p>
                          <p className="text-xs text-slate-400">
                            to {booking.dropoffDate}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-slate-300">
                        <span className="text-purple-400">📅</span>
                        <div>
                          <p className="text-xs text-slate-400">Applied</p>
                          <p className="text-sm font-medium text-white">
                            {new Date(booking.appliedDate).toDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-700/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-slate-400">Total Amount</p>
                          <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                            LKR {bill.total.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-400">{bill.note}</p>
                          <p className="text-sm text-slate-300">
                            {bill.days} days
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Client Information */}
                  <div className="space-y-2 p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
                    <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wide">
                      Client Details
                    </h3>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-xs">👤</span>
                        <span className="text-sm text-white font-medium">
                          {booking.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-xs">✉️</span>
                        <span className="text-sm text-slate-300">
                          {booking.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-xs">📱</span>
                        <span className="text-sm text-slate-300">
                          {booking.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Communication Buttons */}
                  <div className="flex gap-3">
                    <a
                      href={generateEmailLink(
                        booking.email,
                        booking.name,
                        booking.car,
                        bill
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 group/btn relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-sm font-medium px-4 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                      <div className="relative flex items-center justify-center gap-2">
                        <span>✉️</span>
                        <span>Email Client</span>
                      </div>
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
                      className="flex-1 group/btn relative overflow-hidden bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white text-sm font-medium px-4 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25 hover:scale-105"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                      <div className="relative flex items-center justify-center gap-2">
                        <span>💬</span>
                        <span>WhatsApp</span>
                      </div>
                    </a>
                  </div>

                  {/* Management Controls */}
                  <div className="space-y-3 p-4 bg-slate-800/40 rounded-xl border border-slate-700/40 backdrop-blur-sm">
                    <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wide">
                      Booking Management
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <select
                        value={edit.status || booking.status || ""}
                        onChange={(e) =>
                          handleChange(booking._id, "status", e.target.value)
                        }
                        className="bg-slate-700/50 border border-slate-600/50 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
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
                        className="bg-slate-700/50 border border-slate-600/50 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                      >
                        <option value="">Assign Driver</option>
                        {drivers.map((driver) => (
                          <option
                            key={driver.name}
                            value={driver.name}
                            disabled={!isDriverAvailable(driver.name, booking)}
                            className={
                              !isDriverAvailable(driver.name, booking)
                                ? "text-slate-500"
                                : "text-white"
                            }
                          >
                            {driver.name} ({driver.status})
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => updateBooking(booking._id)}
                      className="w-full group/update relative overflow-hidden bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/25 hover:scale-[1.02]"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover/update:translate-y-[-100%] transition-transform duration-500"></div>
                      <div className="relative flex items-center justify-center gap-2">
                        <span className="text-lg">⚡</span>
                        <span>Update Booking</span>
                      </div>
                    </button>
                  </div>
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
