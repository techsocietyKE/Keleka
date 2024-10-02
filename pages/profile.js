import React from 'react';
import { signOut, useSession } from 'next-auth/react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { withAuth } from '@/utils/withAuth';

const Profile = () => {
  const { data: session } = useSession();

  return (
    <Layout>
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Admin Profile</h1>

        {session ? (
          <div className="space-y-4">
            <div>
              <strong className="text-gray-600">First Name:</strong> {session.user.firstname}
            </div>
            <div>
              <strong className="text-gray-600">Last Name:</strong> {session.user.lastname}
            </div>
            <div>
              <strong className="text-gray-600">Contact:</strong> {session.user.phonenumber}
            </div>
            <div> 
              <strong className="text-gray-600">Email:</strong> {session.user.email}
            </div>
            <div>
            <button
          onClick={() => signOut()}
          className="bg-red-500 text-white font-bold px-6 py-2 mt-3"
        >
          Log Out
        </button>
              </div>
          </div>
         
        ) : (
         <div>
           <p className="text-red-500">You are not logged in.</p>
         <Link href={'/login'}>
               <button
          className="bg-green-500 text-white font-bold px-6 py-2 mt-3"
        >
          Log In
        </button>
         </Link>
          </div>
         
        )}
      </div>
    </div>
    </Layout>
  );
};

export default withAuth(Profile,['Admin','Staff','DeliveryGuy']);
