import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Swal from 'sweetalert2';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message,setMessage] = useState('')

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
       
        Swal.fire({
          icon: "error",
          text: "Invalid Credentials,Please check your email and password and try again.",
          timer: 2000,
          showConfirmButton:false,
          toast:true,
          position:'top'
        });
        return;
      }

 
      Swal.fire({
        icon: "success",
        text: "Welcome back!",
        timer: 2000,
        showConfirmButton:false,
          toast:true,
          position:'top'
      }).then(() => {
        // Redirect to profile page after success alert
        router.replace('/');
      });
    } catch (error) {
      console.error(error);
      // Show SweetAlert for general errors
      Swal.fire({
        icon: "error",
        text: "An error occurred during login. Please try again.",
        timer: 2000,
        showConfirmButton:false,
          toast:true,
          position:'top'
      });
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className=" p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Admin Login
        </h1>
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border rounded-md text-gray-800 border-gray-300 outline-none bg-gray-300"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-600 mb-2">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-md text-gray-800 border-gray-300 outline-none bg-gray-300"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded-md"
        >
          Login
        </button>
        {message && (
          <p className="text-center text-red-500 mt-4">{message}</p>
        )}
      </form>
    </div>
  );
}
