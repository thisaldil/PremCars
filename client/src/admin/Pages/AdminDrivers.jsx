import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { X } from "lucide-react";

const AdminDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    licenseNumber: "",
    status: "free",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const res = await API.get("/drivers");
      setDrivers(res.data);
    } catch (err) {
      console.error("Failed to fetch drivers", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/drivers/${editingId}`, formData);
      } else {
        await API.post("/drivers", formData);
      }
      setFormData({ name: "", phone: "", licenseNumber: "", status: "free" });
      setEditingId(null);
      setIsModalOpen(false);
      fetchDrivers();
    } catch (err) {
      console.error("Error saving driver", err);
    }
  };

  const handleEdit = (driver) => {
    setFormData({
      name: driver.name,
      phone: driver.phone,
      licenseNumber: driver.licenseNumber,
      status: driver.status,
    });
    setEditingId(driver._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this driver?")) {
      try {
        await API.delete(`/drivers/${id}`);
        fetchDrivers();
      } catch (err) {
        console.error("Error deleting driver", err);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Drivers</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Driver
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {drivers.map((driver) => (
          <div
            key={driver._id}
            className="bg-white p-4 shadow rounded space-y-2 border border-gray-100"
          >
            <h2 className="text-lg font-semibold">{driver.name}</h2>
            <p>📞 {driver.phone}</p>
            <p>🪪 License: {driver.licenseNumber}</p>
            <p>
              🟢 Status:{" "}
              <span
                className={`font-medium ${
                  driver.status === "busy" ? "text-red-500" : "text-green-600"
                }`}
              >
                {driver.status}
              </span>
            </p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEdit(driver)}
                className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(driver._id)}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full relative">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setFormData({
                  name: "",
                  phone: "",
                  licenseNumber: "",
                  status: "free",
                });
                setEditingId(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingId ? "Edit Driver" : "Add New Driver"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="License Number"
                  value={formData.licenseNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, licenseNumber: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="free">Free</option>
                  <option value="busy">Busy</option>
                </select>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  {editingId ? "Update" : "Add Driver"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDrivers;
