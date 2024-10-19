import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'; // Import router

export default function Register() {
  const [email, setEmail] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [idnumber, setIDNumber] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(''); // State to handle errors
  const router = useRouter(); // Initialize router
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = { 
      firstname,
      lastname,
      phonenumber,
      email,
      password,
      idnumber,
      role
    };
    
    try {
      const response = await axios.post('/api/users', data);

      if (response.status === 200) {
        setMessage('User registered successfully');
        setError('');
        // Redirect to /users after registration
        router.push('/users');
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message); // Display backend error message
      } else {
        setError('Error registering user');
      }
      setMessage('');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Register
        </h1>
        <div className='flex gap-2 flex-row'>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Firstname</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md text-gray-800"
              placeholder="Enter your firstname"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Lastname</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md text-gray-800"
              placeholder="Enter your lastname"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
            />
          </div>
        </div>
        <div className='flex gap-2 flex-row'>
        <div className="mb-6">
            <label className="block text-gray-600 mb-2">Phonenumber</label>
            <input
              type="phonenumber"
              className="w-full px-4 py-2 border rounded-md text-gray-800"
              placeholder="Enter your phonenumber"
              value={phonenumber}
              onChange={(e) => setPhonenumber(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-600 mb-2">ID Number</label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-md text-gray-800"
              placeholder="Enter your ID number"
              value={idnumber}
              onChange={(e) => setIDNumber(e.target.value)}
              required
            />
          </div>
        </div>
      
       
        <div className='flex gap-2 flex-row'>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-md text-gray-800"
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
              className="w-full px-4 py-2 border rounded-md text-gray-800"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-600 mb-2">Role</label>
          <select 
            value={role}
            onChange={(e) => setRole(e.target.value)} // Update role state
            className="w-full px-4 py-2 border rounded-md text-gray-800"
            required
          >
            <option value="">Choose a Role</option>
            <option value="Admin">Admin</option>
            <option value="Staff">Staff</option>
            <option value="Customer">Customer</option>
          </select>
        </div>
        
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded-md"
        >
          Register
        </button>

        {/* Show error message */}
        {error && (
          <p className="text-center text-red-500 mt-4">{error}</p>
        )}

        {/* Show success message */}
        {message && (
          <p className="text-center text-green-500 mt-4">{message}</p>
        )}
      </form>
    </div>
  );
}
