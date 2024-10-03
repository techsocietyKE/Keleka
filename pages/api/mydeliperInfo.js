import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import moment from 'moment'; 
import withAuth from '@/utils/withAuth';


const PersonalDeliveryInfo = () => {
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
            name: firstOrder.name,
            phoneNumber: firstOrder.phonenumber,
            county: firstOrder.county,
            city: firstOrder.city,
            street: firstOrder.street,
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
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
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
    <div className="bg-[#201F31] md:p-4 p-2">
      {personalInfo ? (
        <div>
          <h1 className="text-gray-100 pt-12">Personal Information</h1>
          <div className="flex flex-wrap gap-2 bg-[#262638] md:p-5 p-3 shadow-lg rounded-md">
            <div>
              <h1 className="text-gray-200 text-md">Name</h1>
              <h1 className="text-gray-400 text-sm">{personalInfo.name || 'N/A'}</h1>
            </div>
            <div className="border-l border-gray-500 mx-1 px-4">
              <h1 className="text-gray-200 text-md">Contact</h1>
              <h1 className="text-gray-400 text-sm">{personalInfo.phoneNumber || "N/A"}</h1>
            </div>
            <div className="border-l border-gray-500 mx-1 px-4">
              <h1 className="text-gray-200 text-md">Email</h1>
              <h1 className="text-gray-400 text-sm">{personalInfo.email}</h1>
            </div>
          </div>

          <h1 className="text-gray-100 mt-5">Delivery Information</h1>
          <div className="flex flex-wrap gap-2 bg-[#262638] md:p-5 p-3 shadow-lg rounded-md my-4">
            <div>
              <h1 className="text-gray-200 text-md">County</h1>
              <h1 className="text-gray-400 text-sm">{personalInfo.county}</h1>
            </div>
            <div className="border-l border-gray-500 mx-1 px-4">
              <h1 className="text-gray-200 text-md">City</h1>
              <h1 className="text-gray-400 text-sm">{personalInfo.city}</h1>
            </div>
            <div className="border-l border-gray-500 mx-1 px-4">
              <h1 className="text-gray-200 text-md">Street</h1>
              <h1 className="text-gray-400 text-sm">{personalInfo.street}</h1>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-700">
          <p>No personal information found.</p>
        </div>
      )}

      <div className="text-gray-100 mt-5">
        <h1>Your Order History</h1>
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <div key={index} className="bg-[#262638] p-5 shadow-lg rounded-md my-4">
              <p className="underline">
                Order : {index + 1} - <span className="text-gray-400">{moment(order.createdAt).format('LLL')}</span>
              </p>
              
              <ul className="list-disc list-inside text-gray-200">
                {order.book_items.map((item, idx) => (
                  <li key={idx} className="ml-2 my-2">
                    {item.price_data.book_data?.name} x {item.quantity}
                  </li>
                ))}
              </ul>

              <h1 className="text-green-400 ml-5 font-semibold">Amount: Ksh {order.amount}</h1>

              <p className={`ml-5 my-2 p-2 rounded-md w-32 text-center ${order.paid ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                Paid: {order.paid ? 'Yes' : 'No'}
              </p>

              {order.paymentMethod === 'cod' && (
                <p className={`ml-5 my-2 p-2 rounded-md w-32 text-start ${
                  order.DeliveryStatus === 'Delivered'
                    ? 'bg-green-500'
                    : order.DeliveryStatus === 'Pending'
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                } text-white`}>
                  Delivery Status: {order.DeliveryStatus || 'Pending'}
                </p>
              )}
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default withAuth(PersonalDeliveryInfo);
