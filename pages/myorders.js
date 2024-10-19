import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import moment from 'moment';

const MyOrders = () => {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [personalInfo, setPersonalInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (status === 'loading') return;
      if (status === 'unauthenticated') {
        setLoading(false);
        setError('You must be signed in to view your orders.');
        return;
      }

      try {
        const res = await fetch("/api/myorders");
        if (!res.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await res.json();
        setOrders(data.orders);

        if (data.orders.length > 0) {
          const firstOrder = data.orders[0];
          setPersonalInfo({
            fullname: firstOrder.fullname,
            phoneNumber: firstOrder.phoneNumber,
            email: session.user.email,
          });
        }
      } catch (error) {
        setError("Error loading orders: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [status]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
          <span className="hidden">Loading...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 font-semibold">{error}</div>
    );

  return (
    <div className="bg-white min-h-screen md:p-8 p-4">
      {personalInfo ? (
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">Personal Information</h1>
          <div className="flex flex-wrap gap-4 bg-gray-100 p-6 shadow-lg rounded-md">
            <div className="w-full md:w-1/3">
              <h2 className="text-gray-600 text-lg">Full Name</h2>
              <p className="text-gray-800 text-md">{personalInfo.fullname || 'N/A'}</p>
            </div>
            <div className="w-full md:w-1/3">
              <h2 className="text-gray-600 text-lg">Contact</h2>
              <p className="text-gray-800 text-md">{personalInfo.phoneNumber || "N/A"}</p>
            </div>
            <div className="w-full md:w-1/3">
              <h2 className="text-gray-600 text-lg">Email</h2>
              <p className="text-gray-800 text-md">{personalInfo.email}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-700 mb-8">
          <p>No personal information found.</p>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Order History</h2>
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <div key={index} className="bg-gray-50 p-6 shadow-lg rounded-md my-6">
              <p className="underline font-semibold text-lg text-gray-700">
                Order {index + 1} - <span className="text-gray-500">{moment(order.createdAt).format('LLL')}</span>
              </p>
              
              <ul className="list-disc list-inside text-gray-600 mt-4">
                {order.product_items && order.product_items.length > 0 ? (
                  order.product_items.map((item, idx) => (
                    <li key={idx} className="my-2">
                      {item.price_data.product_data?.name} 
                    </li>
                  ))
                ) : (
                  <li className="my-2">No items found in this order.</li>
                )}
              </ul>

              <div className="mt-4">
                <p className="text-green-500 font-semibold">Amount: Ksh {order.grandTotal}</p>
              </div>

              <div className="mt-2">
                <p className={`inline-block my-2 p-2 rounded-md w-36 text-center ${order.paid ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                  <p>Paid: {order.paid ? 'Yes' : 'No'}</p>
                  <p>By: {order.paymentMethod === 'mpesa' ? 'Paid with Mpesa' : 'COD'}</p>
                </p>
              </div>

              {order.paymentMethod === 'cod' && (
                <div className="mt-2 w-auto">
                  <p className={`inline-block p-2 rounded-md w-36 text-center ${order.Confirmed ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                    Order Confirmed: {order.Confirmed ? 'Yes' : 'No'}
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-700">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
