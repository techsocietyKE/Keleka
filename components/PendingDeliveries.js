import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import moment from "moment";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function PendingDeliveries() {
  const { data: session } = useSession(); 
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('/api/pendingDeliveries').then((response) => {
      setOrders(response.data);
      console.log(response.data)
    });
  }, []);

  const isAdmin = session?.user?.role === "Admin";
  const isStaff = session?.user?.role === "Staff";
  const isDeliveryGuy = session?.user?.role === "DeliveryGuy";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-left">Recipient</th>
              <th className="py-3 px-6 text-left">Items</th>
              <th className="py-3 px-6 text-left">Price</th>
              <th className="py-3 px-6 text-left">Payment Status</th>
              <th className="py-3 px-6 text-left">Payment Method</th>
              <th className="py-3 px-6 text-left">Delivery Status</th>
              <th className="py-3 px-6 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {moment(order.createdAt).format('MMM DD, YYYY')}
                  </td>
                  <td className="py-3 px-6 text-left">
                    <div className="text-sm">
                      <p className="font-semibold">{order.name}</p>
                      <p>{order.email}</p>
                      <p>{order.phonenumber}</p>
                      <p>
                        {order.county}, {order.street}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-left">
                    {order.book_items && order.book_items.length > 0 ? (
                      order.book_items.map((item, index) => (
                        <div key={index}>
                          {item.price_data.book_data.name} x {item.quantity}
                        </div>
                      ))
                    ) : (
                      <p>No items</p>
                    )}
                  </td>
                  <td className="py-3 px-6 text-left">{order.amount}</td>
                  <td className="py-3 px-6 text-left">
                    <span
                      className={`inline-block px-3 py-1 font-semibold text-sm rounded-full ${
                        order.paid ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {order.paid ? 'Paid' : 'Not Paid'}
                    </span>
                    {order.Mpesa && (
                      <span className="ml-2 text-green-500">(Paid with Mpesa)</span>
                    )}
                  </td>
                  <td className="py-3 px-6 text-left">{order.paymentMethod}</td>
                  <td className="py-3 px-6 text-left">
    <span
        className={`inline-block px-3 py-1 font-semibold text-sm rounded-full 
            ${order.DeliveryStatus === "Delivered" ? "bg-green-100 text-green-600" : ""}
            ${order.DeliveryStatus === "Pending" ? "bg-red-100 text-red-600" : ""}
            ${order.DeliveryStatus === "Cancelled" ? "bg-orange-100 text-orange-600" : ""}
        `}
    >
        {order.DeliveryStatus}
    </span>
</td>
                  <td className="pt-10 px-6 flex items-center gap-3 text-left">
                  <Link href={'/orders/edit/' + order._id} className="text-blue-600 hover:text-blue-800">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className="w-6 h-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                            />
                                        </svg>
                                    </Link>

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-5">
                  No pending deliveries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
