import React from "react";
import {
  Car,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Bookings",
      value: "1,234",
      change: "+12.3%",
      icon: Calendar,
    },
    {
      title: "Active Cars",
      value: "45",
      change: "+5.4%",
      icon: Car,
    },
    {
      title: "Total Customers",
      value: "892",
      change: "+18.2%",
      icon: Users,
    },
    {
      title: "Revenue",
      value: "$52,389",
      change: "+8.1%",
      icon: DollarSign,
    },
  ];

  const recentBookings = [
    {
      id: 1,
      customer: "John Doe",
      car: "Toyota Axio",
      date: "2024-02-15",
      status: "Active",
    },
    {
      id: 2,
      customer: "Jane Smith",
      car: "Honda Vezel",
      date: "2024-02-14",
      status: "Completed",
    },
    {
      id: 3,
      customer: "Mike Johnson",
      car: "Mercedes-Benz E-Class",
      date: "2024-02-14",
      status: "Pending",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
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
                <tr key={booking.id}>
                  <td className="px-6 py-4 text-gray-900">#{booking.id}</td>
                  <td className="px-6 py-4 text-gray-900">
                    {booking.customer}
                  </td>
                  <td className="px-6 py-4 text-gray-900">{booking.car}</td>
                  <td className="px-6 py-4 text-gray-900">{booking.date}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        booking.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "Completed"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {booking.status}
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
