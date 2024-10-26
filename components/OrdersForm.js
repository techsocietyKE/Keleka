import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function OrderForm({
  _id,
  grandTotal: existingGrandTotal,
  paid: existingPaid,
  status: existingStatus,
  paymentMethod: existingPaymentMethod,
}) {
  const { data: session } = useSession();
  const [grandTotal, setGrandTotal] = useState(existingGrandTotal || "");
  const [paid, setPaid] = useState(existingPaid || false);
  const [status, setStatus] = useState(existingStatus || "");

  const router = useRouter();

  async function saveOrder(ev) {
    ev.preventDefault();
    const data = {
      paid,
      status,
    };

    if (_id) {
      await axios.put("/api/editorder", { ...data, _id });
    } else {
      await axios.post("/api/editorder", data);
    }

    router.push("/orders");
  }

  // Define background color classes based on status
  const getStatusClass = () => {
    switch (status) {
      case "Pending":
        return "bg-red-500 text-white";
      case "Ready":
        return "bg-green-500 text-white";
      case "Completed":
        return "bg-orange-500 text-white";
      default:
        return "bg-gray-300 text-gray-700";
    }
  };

  return (
    <div>
      <form
        onSubmit={saveOrder}
        className="p-4 bg-white rounded-lg shadow-lg max-w-2xl mx-auto"
      >
        <h2 className="text-xl font-semibold mb-4">Update Order</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Amount</label>
          <input
            disabled
            type="text"
            value={grandTotal}
            onChange={(ev) => setGrandTotal(ev.target.value)}
            className="border border-gray-300 rounded-lg w-full p-2"
            required
          />
        </div>

        <div className="flex items-center py-3">
          <label className="block text-gray-700 mb-2">Payment</label>
          <input
            type="checkbox"
            checked={paid}
            onChange={(ev) => setPaid(ev.target.checked)}
            className="ml-4 w-4 h-4"
          />
          <span
            className={`ml-2 ${paid ? "text-green-500" : "text-red-500"} font-semibold`}
          >
            {paid ? "Paid" : "Not Paid"}
          </span>
        </div>

        <div className="mb-6">
          <label className="block text-gray-600 mb-2">Status</label>
          <select
            value={status}
            onChange={(ev) => setStatus(ev.target.value)}
            className="w-full px-4 py-2 border rounded-md text-gray-800"
          >
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="Ready">Ready</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Display the status with a background color */}
        <div className="mb-6">
          <span className={`inline-block px-3 py-1 font-semibold text-sm rounded-full ${getStatusClass()}`}>
            {status || "No Status"}
          </span>
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white rounded-lg py-2 mt-4 transition"
        >
          Update Details
        </button>
      </form>
    </div>
  );
}
