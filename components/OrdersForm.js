import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function OrderForm({
  _id,
  name: existingName,
  email: existingEmail,
  phonenumber: existingPhoneNumber,
  grandTotal: existingGrandTotal,
  paid: existingPaid,
  Confirmed: existingConfirmed,
  paymentMethod:existingPaymentMethod

}) {
  const { data: session } = useSession();
  const [grandTotal, setGrandTotal] = useState(existingGrandTotal || "");
  const [paid, setPaid] = useState(existingPaid || false);
  const [Confirmed, setConfirmed] = useState(existingConfirmed || false);


  const router = useRouter();

  async function saveOrder(ev) {
    ev.preventDefault();
    const data = {
      paid,
      Confirmed,
    };

    if (_id) {
      await axios.put("/api/editorder", { ...data, _id });
    } else {
      await axios.post("/api/editorder", data);
    }

    router.push("/orders");
  }

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
            {Confirmed ? "Order Complete" : "Pending"}
          </span>
        </div>
    
        <button
          type="submit"
          className="w-full bg-primary  text-white rounded-lg py-2 mt-4  transition"
        >
          Update Details
        </button>
      </form>
    </div>
  );
}
