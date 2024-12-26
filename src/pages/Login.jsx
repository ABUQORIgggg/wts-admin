import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { login } from '../redux/authSclice';
import { FaUser, FaLock } from 'react-icons/fa';
import { Rings } from 'react-loader-spinner';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `https://bakend-wtc-4.onrender.com/api/v1/auth/login`,
        { username, password }
      );

      if (response.data.user) {
        localStorage.setItem('admin', JSON.stringify(response.data.user));
        dispatch(login(response.data.user));
        navigate('/app/home');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login attempt failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/path/to/your/background-image.jpg)' }}>
      <div className="bg-white bg-opacity-80 p-10 rounded-3xl shadow-2xl w-96 md:w-1/3 lg:w-1/4">
        <h1 className="text-3xl font-bold text-center text-black mb-6">Admin Panel Login</h1>
        {error && <p className="text-red-500 mb-4" role="alert">{error}</p>}

        {loading && (
          <div className="flex justify-center mb-4">
            <Rings color="#00BFFF" height={50} width={50} />
          </div>
        )}

        <div className="mb-6 relative">
          <FaUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-200" />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            autoComplete="username"
            className="border rounded-full p-4 pl-12 w-full text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            aria-label="Username"
          />
        </div>

        <div className="mb-6 relative">
          <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-200" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            autoComplete="current-password"
            className="border rounded-full p-4 pl-12 w-full text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            aria-label="Password"
          />
        </div>

        <button
          className={`bg-blue-600 hover:bg-blue-700 transition duration-300 text-white font-semibold py-4 px-6 rounded-full w-full shadow-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Login'}
        </button>
      </div>
    </div>
  );
};

export default Login;
