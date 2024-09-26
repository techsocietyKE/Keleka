import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import moment from "moment";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('/api/orders').then(response => {
      setOrders(response.data);
    });
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Orders</h1>
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
                <th className="py-3 px-6 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
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
                    <td className="py-3 px-6 text-left">
                    {order.amount}
                    </td>
                    <td className="py-3 px-6 text-left">
                      <span
                        className={`inline-block px-3 py-1 font-semibold text-sm rounded-full ${
                          order.paid
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {order.paid ? 'Paid' : 'Not Paid'}
                      </span>
                      {order.Mpesa && (
                        <span className="ml-2 text-green-500">
                          (Paid with Mpesa)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-6 text-left">{order.paymentMethod}</td>
                    <td className="pt-10 px-6 flex items-center gap-3  text-left">
                    <Link href={'/orders/delete/' + order._id}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                   {/* view an item */}
                </Link>
        
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
