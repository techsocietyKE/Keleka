import Header from '@/components/Header';
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
          text: "Invalid Credentials , check your email and password and try again.",
          timer:2000,
          showConfirmButton:false,
          toast:true,
          position:'top'
        });
        return;
      }

      
      Swal.fire({
        icon: "success",
        text: "Login Successful,welcome back!",
        timer:2000,
        showConfirmButton:false,
        toast:true,
        position:'top'
        
      }).then(() => {
        router.replace("/cart");
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        text: "An error occurred during login. Please try again.",
        timer:2000,
        showConfirmButton:false,
        toast:true,
        position:'top'
      });
    }
  };
  return (
    <>
    <Header/>
    <div className="flex flex-col h-screen justify-center items-center bg-gray-100 p-4">
      <div className=" shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">Welcome  Back</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="text-md font-medium text-gray-700 my-2">Enter Email</label>
            <input
              className="outline-none border border-gray-200 bg-gray-50 py-2 px-3 rounded-lg"
              type="email"
              placeholder="email@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-md font-medium text-gray-700 my-2">Enter Password</label>
            <input
              className="outline-none border border-gray-200 bg-gray-50 py-2 px-3 rounded-lg"
              type="password"
              placeholder="*********"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-primary text-white py-2 rounded-md font-medium hover:shadow-md transition duration-300"
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
    </>
  );
};

export default Register;
