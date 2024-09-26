import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Swal from 'sweetalert2';

const Register = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res.error) {
        // Show SweetAlert for invalid credentials
        Swal.fire({
          icon: "error",
          title: "Invalid Credentials",
          text: "Please check your email and password and try again.",
           timer:2000
        });
        return;
      }

      // Show SweetAlert for successful login
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome back!",
        timer:2000
      }).then(() => {
        // Redirect to profile page after success alert
        router.replace("/");
      });
    } catch (error) {
      console.error(error);
      // Show SweetAlert for general errors
      Swal.fire({
        icon: "error",
        title: "Login Error",
        text: "An error occurred during login. Please try again.",
        timer:2000
      });
    }
  };
  return (
    <div className="flex flex-col h-screen justify-center items-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Enter Email</label>
            <input
              className="outline-none border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:ring-2 focus:ring-indigo-500"
              type="email"
              placeholder="email@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Enter Password</label>
            <input
              className="outline-none border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:ring-2 focus:ring-indigo-500"
              type="password"
              placeholder="*********"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-[#201F31] text-white py-2 rounded-md font-medium hover:bg-indigo-800 transition duration-300"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
            No account?{' '}
          <Link href="/register" className="text-indigo-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
