'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { withAuth } from '@/utils/withAuth';

const StatsCount = () => {
  const { data: session, status } = useSession(); // Access session data
  const [bookCount, setBookCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [pendingDeliveryCount,setPendingDeliveryCount]= useState(0)

  const isAdmin = session?.user?.role === "Admin";
  const isStaff = session?.user?.role === "Staff";
  const isDeliveryGuy = session?.user?.role === "DeliveryGuy";

  useEffect(() => {
    // Fetch books count
    axios.get('/api/count/bookCount').then(response => {
      setBookCount(response.data.count);
    }).catch(error => console.error('Error fetching books count:', error));

    // Fetch orders count
    axios.get('/api/count/orderCount').then(response => {
      setOrderCount(response.data.count);
    }).catch(error => console.error('Error fetching orders count:', error));

    // Fetch users count
    axios.get('/api/count/userCount').then(response => {
      setUserCount(response.data.count);
    }).catch(error => console.error('Error fetching users count:', error));

    axios.get('/api/count/pendingDeliveryCount').then(response => {
      setPendingDeliveryCount(response.data.count);
    }).catch(error => console.error('Error fetching order count:', error));

})

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">  
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {isAdmin && (
        <>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700">Total Books</h2>
          <p className="text-3xl font-bold text-green-500 mt-4">{bookCount}</p>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700">Orders</h2>
          <p className="text-3xl font-bold text-blue-500 mt-4">{orderCount}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700">Pending Deliveries</h2>
          <p className="text-3xl font-bold text-blue-500 mt-4">{pendingDeliveryCount}</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700">Users</h2>
          <p className="text-3xl font-bold text-yellow-500 mt-4">{userCount}</p>
        </div>
        </>
      )}

       {isStaff && (
        <>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700">Total Books</h2>
          <p className="text-3xl font-bold text-green-500 mt-4">{bookCount}</p>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700">Orders</h2>
          <p className="text-3xl font-bold text-blue-500 mt-4">{orderCount}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700">Pending Deliveries</h2>
          <p className="text-3xl font-bold text-blue-500 mt-4">{pendingDeliveryCount}</p>
        </div>
        </>
      )}

{isDeliveryGuy && (
        <>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700">Pending Deliveries</h2>
          <p className="text-3xl font-bold text-blue-500 mt-4">{pendingDeliveryCount}</p>
        </div>
        </>
      )}
        

  
        
      </div>
    </div>
  );
};

export default withAuth(StatsCount,['Admin','Staff','DeliveryGuy']);