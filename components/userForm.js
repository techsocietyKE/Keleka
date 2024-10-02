import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function UserForm({
    _id,
    email: existingEmail,
    firstname: existingFirstname,
    lastname: existingLastname,
    password: existingPassword,
    role: existingRole,  // role passed as a prop
    idnumber: existingIdNumber,
    phonenumber:  existingPhoneNumber,

}) {
  const [email, setEmail] = useState(existingEmail || '');
  const [firstname, setFirstname] = useState(existingFirstname || '');
  const [lastname, setLastname] = useState(existingLastname || '');
  const [password, setPassword] = useState(existingPassword || '');
  const [idnumber, setIdnumber] = useState(existingIdNumber || '');
  const [phonenumber, setPhonenumber] = useState(existingPhoneNumber || '');
  const [role, setRole] = useState(existingRole || ''); 
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { 
        email, 
        firstname,
        lastname, 
        password, 
        idnumber,
        phonenumber,
        role,
    };
    try {
      if (_id) {
          await axios.put('/api/users', { ...data, _id });
      } else {
          await axios.post('/api/users', data);
      }
      setMessage('User saved successfully!');
      router.push('/users');
    } catch (error) {
      setMessage('Error saving user');
      console.error(error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          { _id ? 'Edit User' : 'Register' }
        </h1>
        <div className='flex flex-row'>
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
        <div className='flex flex-row'>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">ID Number</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md text-gray-800"
              placeholder="Enter ID"
              value={idnumber}
              onChange={(e) => setIdnumber(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Contact</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md text-gray-800"
              placeholder="Enter contact"
              value={phonenumber}
              onChange={(e) => setPhonenumber(e.target.value)}
              required
            />
          </div>
        </div>
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
        <div className="mb-6">
          <label className="block text-gray-600 mb-2">Role</label>
          <select
            value={role}  // Bind to the role state
            onChange={(e) => setRole(e.target.value)}  // Update role state when selecting
            className="w-full px-4 py-2 border rounded-md text-gray-800"
            required
          >
            <option value="">Select a Role</option>
            <option value="Admin">Admin</option>
            <option value="Staff">Staff</option>
            <option value="DeliveryGuy">Delivery Guy</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md"
        >
          { _id ? 'Update' : 'Register' }
        </button>
        {message && (
          <p className="text-center text-green-500 mt-4">{message}</p>
        )}
      </form>
    </div>
  );
}
