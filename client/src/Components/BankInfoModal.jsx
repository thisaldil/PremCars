import React, { useEffect, useState } from "react";
import {
  Shield,
  Building2,
  Calendar,
  Info,
  CheckCircle2,
  X,
} from "lucide-react";

const BankInfoModal = ({ isOpen, onClose }) => {
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    const sampleData = {
      bankTransfer: {
        bankName: "Commercial Bank - Baddegama Branch",
        accountName: "Thisal Dilmith Gonsal Korala",
        accountNumber: "8015703343",
      },
      paymentOptions: [
        {
          title: "Pay in Installments",
          description: "Split your rental fee into easy monthly installments.",
        },
        {
          title: "Deposit & Final Payment",
          description:
            "Pay 20% deposit now and settle the balance before pickup.",
        },
        {
          title: "Pay in Full",
          description:
            "Get a 5% discount when you pay the full rental upfront.",
        },
      ],
    };

    setPaymentDetails(sampleData);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="relative bg-white rounded-lg shadow-lg max-w-2xl w-full">
      <div className="absolute top-4 right-4">
        <button
          onClick={onClose}
          className="bg-white text-gray-600 hover:text-red-500 border border-gray-200 shadow-md rounded-full p-2 z-50"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-blue-600 text-white px-6 pt-6 pb-4 rounded-t-lg">
        <h1 className="text-2xl font-bold">Payment Details</h1>
        <p className="mt-1 text-sm">
          Secure and flexible payment options with PremCars Car Rental.
        </p>
      </div>

      {paymentDetails ? (
        <div className="p-6 space-y-6 text-sm text-gray-800">
          <div>
            <div className="flex items-center mb-2">
              <Building2 className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold">Bank Transfer</h2>
            </div>
            <ul className="space-y-1">
              <li>
                <strong>Bank:</strong> {paymentDetails.bankTransfer.bankName}
              </li>
              <li>
                <strong>Account Name:</strong>{" "}
                {paymentDetails.bankTransfer.accountName}
              </li>
              <li>
                <strong>Account Number:</strong>{" "}
                {paymentDetails.bankTransfer.accountNumber}
              </li>
            </ul>
          </div>

          <div>
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold">Flexible Options</h2>
            </div>
            <ul className="space-y-2">
              {paymentDetails.paymentOptions.map((item, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-1" />
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-start space-x-2">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <p>
              <strong>Secure Payments:</strong> All transactions are encrypted
              and protected.
            </p>
          </div>

          <div className="flex items-start space-x-2">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <p>
              Need help? Contact us at{" "}
              <span className="font-semibold">payments@premcars.lk</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="p-6 text-center text-sm">Loading payment info...</div>
      )}
    </div>
  );
};

export default BankInfoModal;
