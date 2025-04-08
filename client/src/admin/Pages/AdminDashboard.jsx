import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import {
  ArrowUpRight,
  Car,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
} from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    fetchDashboardStats();
    fetchRecentBookings();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [bookingsRes, carsRes, driversRes] = await Promise.all([
        API.get("/bookings"),
        API.get("/cars"),
        API.get("/drivers"),
      ]);

      const bookings = bookingsRes.data;
      const cars = carsRes.data;
      const drivers = driversRes.data;

      const confirmedBookings = bookings.filter(
        (b) => b.status === "Confirmed"
      );
      const uniqueCustomers = new Set(bookings.map((b) => b.email)).size;
      const totalRevenue = confirmedBookings.reduce((acc, b) => {
        const start = new Date(b.pickupDate);
        const end = new Date(b.dropoffDate);
        const days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
        let rate = b.car.pricePerDay;
        if (b.withDriver) {
          if (rate < 45) rate = 10000;
          else if (rate < 70) rate = 18000;
          else rate = 25000;
        }
        return acc + days * rate;
      }, 0);

      setStats([
        {
          title: "Total Bookings",
          value: bookings.length.toString(),
          change: "+12.3%",
        },
        {
          title: "Active Cars",
          value: cars.length.toString(),
          change: "+5.4%",
        },
        {
          title: "Total Customers",
          value: uniqueCustomers.toString(),
          change: "+18.2%",
        },
        {
          title: "Revenue",
          value: `LKR ${totalRevenue.toLocaleString()}`,
          change: "+8.1%",
        },
      ]);
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    }
  };

  const fetchRecentBookings = async () => {
    try {
      const res = await API.get("/bookings");
      const sorted = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setRecentBookings(sorted.slice(0, 5));
    } catch (err) {
      console.error("Failed to fetch recent bookings", err);
    }
  };

  const iconMap = {
    "Total Bookings": Calendar,
    "Active Cars": Car,
    "Total Customers": Users,
    Revenue: DollarSign,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = iconMap[stat.title];
          return (
            <div
              key={index}
              className="bg-white p-5 rounded-xl shadow flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500">{stat.change}</span>
                </div>
              </div>
              <h3 className="text-2xl font-semibold">{stat.value}</h3>
              <p className="text-gray-600">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow">
        <div className="p-5 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Bookings
          </h2>
          <button className="text-sm text-blue-600 hover:underline flex items-center">
            View all <ArrowUpRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Car</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentBookings.map((booking) => (
                <tr key={booking._id}>
                  <td className="px-6 py-4 text-gray-900">
                    #{booking._id.slice(-5)}
                  </td>
                  <td className="px-6 py-4 text-gray-900">{booking.name}</td>
                  <td className="px-6 py-4 text-gray-900">
                    {booking.car.name}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {booking.pickupDate}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        booking.status === "Confirmed"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "Cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {booking.status || "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
