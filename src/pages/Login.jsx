import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { login } from '../redux/authSclice';
import { FaUser, FaLock } from 'react-icons/fa';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('https://bakend-wtc-4.onrender.com/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      // Сохраняем данные пользователя в Redux и localStorage
      dispatch(login(result.user));
      localStorage.setItem('user', JSON.stringify(result.user));

      // Перенаправляем пользователя
      navigate('/app/home');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col text-white items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/path/to/your/background-image.jpg)' }}>
      <div className="bg-white bg-opacity-80 p-10 rounded-3xl shadow-2xl w-96 md:w-1/3 lg:w-1/4">
        <h1 className="text-3xl font-bold text-center text-white mb-6">Admin Panel Login</h1>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        <div className="mb-6 relative">
          <FaUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            autoComplete="username"
            className="border rounded-full p-4 pl-12 w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Username"
          />
        </div>

        <div className="mb-6 relative">
          <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            autoComplete="current-password"
            className="border rounded-full p-4 pl-12 w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Password"
          />
        </div>

        <button
          className="bg-blue-600 hover:bg-blue-700 transition duration-300 text-white font-semibold py-4 px-6 rounded-full w-full shadow-lg"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
