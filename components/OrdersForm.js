import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function OrderForm({
  _id,
  name: existingName,
  email: existingEmail,
  phonenumber: existingPhoneNumber,
  amount: existingAmount,
  paid: existingPaid,
  Confirmed: existingConfirmed,
  DeliveryStatus: existingDeliveryStatus,
}) {
  const { data: session } = useSession();
  const [name, setName] = useState(existingName || "");
  const [email, setEmail] = useState(existingEmail || "");
  const [phonenumber, setPhoneNumber] = useState(existingPhoneNumber || "");
  const [amount, setAmount] = useState(existingAmount || "");
  
  const [paid, setPaid] = useState(existingPaid || false);
  const [Confirmed, setConfirmed] = useState(existingConfirmed || false);
  const [DeliveryStatus, setDeliveryStatus] = useState(existingDeliveryStatus || "Pending");

  const router = useRouter();

  async function saveOrder(ev) {
    ev.preventDefault();
    const data = {
      name,
      email,
      phonenumber,
      amount,
      paid,
      Confirmed,
      DeliveryStatus,
    };

    if (_id) {
      await axios.put("/api/editorder", { ...data, _id });
    } else {
      await axios.post("/api/editorder", data);
    }

    router.push("/orders");
  }

  const sendDeliveryEmail = async () => {
    try {
      const response = await axios.post('/api/send-delivery-email', {
        email: email, 
        subject: 'Incoming Tuk Cafeteria  Delivery',


        message: `Hi ${name}, your order will be delivered in two days.`
      });

      if (response.data.success) {
        alert('Delivery email sent successfully');
      } else {
        alert('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending delivery email:', error);
      alert('Error sending email');
    }
  };

  const isDeliveryGuy = session?.user?.role === "DeliveryGuy";

  return (
    <div>
      <form
        onSubmit={saveOrder}
        className="p-4 bg-white rounded-lg shadow-lg max-w-2xl mx-auto"
      >
      <h2 className="text-xl font-semibold mb-4">Update Order </h2>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Amount</label>
        <input
        disabled
          type="text"
          value={amount}
          onChange={(ev) => setAmount(ev.target.value)}
          className="border border-gray-300 rounded-lg w-full p-2"
          required
        />
      </div>

      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Delivery Status</label>
        <select
          value={DeliveryStatus}
          onChange={(ev) => setDeliveryStatus(ev.target.value)}
          className="border border-gray-300 rounded-lg w-full p-2"
        >
          <option value="Pending">Pending</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      
      <div className="flex items-center py-3">
        <label className="block text-gray-700 mb-2">Paid</label>
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

      {!isDeliveryGuy && ( // Only render if not a delivery guy
        <div className="flex items-center py-3">
          <label className="block text-gray-700 mb-2">Confirmed</label>
          <input
            type="checkbox"
            checked={Confirmed}
            onChange={(ev) => setConfirmed(ev.target.checked)}
            className="ml-4 w-4 h-4"
          />
          <span
            className={`ml-2 ${Confirmed ? "text-green-500" : "text-red-500"} font-semibold`}
          >
            {Confirmed ? "Confirmed" : "Pending"}
          </span>
        </div>
      )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded-lg py-2 mt-4 hover:bg-blue-700 transition"
        >
          Update Details
        </button>
      </form>

      <button
        type="button"
        className="w-full bg-green-600 text-white rounded-lg py-2 mt-4 hover:bg-green-700 transition"
        onClick={sendDeliveryEmail}
      >
        Notify for Delivery
      </button>
    </div>
  );
}
