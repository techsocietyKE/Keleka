import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Swal from 'sweetalert2';

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "All fields are necessary.",
        timer: 2000
      });
      return;
    }

    try {
      const resUserExists = await fetch("/api/userExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const { user } = await resUserExists.json();

      if (user) {
        Swal.fire({
          icon: "error",
          text: "User already exists.",
          timer: 2000,
          showConfirmButton:false,
          toast:true,
          position:'top'
        });
        return;
      }

      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          fullname,
          phoneNumber
        }),
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          text: "You have successfully registered!",
          timer: 2000,
          showConfirmButton:false,
          toast:true,
          position:'top'
        }).then(() => {
          router.push("/login");
        });
      } else {
        Swal.fire({
          icon: "error",
          text: "User registration failed.",
          timer: 2000,
          showConfirmButton:false,
          toast:true,
          position:'top'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "An error occurred during registration.",
        timer: 2000,
        showConfirmButton:false,
        toast:true,
        position:'top'
      });
      console.error("Error during registration: ", error);
    }
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center bg-gray-100 p-4">
      <div className=" shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">Create An Account</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="text-md font-medium text-gray-700 my-2">Enter Email</label>
            <input
              className="outline-none border border-gray-200 bg-gray-50 py-2 px-3 rounded-lg"
              type="email"
              placeholder="email@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-md font-medium text-gray-700 my-2">Enter Password</label>
            <input
              className="outline-none border border-gray-200 bg-gray-50 py-2 px-3 rounded-lg"
              type="password"
              placeholder="*********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-md font-medium text-gray-700 my-2">Enter fullname</label>
            <input
              className="outline-none border border-gray-200 bg-gray-50 py-2 px-3 rounded-lg"
              type="text"
              placeholder="Enter your Name"
              value={fullname}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-md font-medium text-gray-700 my-2">Phone Number</label>
            <input
              className="outline-none border border-gray-200 bg-gray-50 py-2 px-3 rounded-lg"
              type="number"
              placeholder="Enter your phonenumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-primary text-white py-2 rounded-md font-medium hover:shadow-md transition duration-300"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
