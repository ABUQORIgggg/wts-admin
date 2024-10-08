import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { login } from '../redux/authSclice';
import { FaUser, FaLock } from 'react-icons/fa'; // Импорт иконок

const Login = () => {
  const store = useSelector((store) => store);
  console.log(store);

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/v1/admin/login', {
        username,
        password,
      });

      console.log('Ответ сервера:', response.data);

      if (response.data.admin) {
        console.log('Авторизация успешна');
        localStorage.setItem('admin', JSON.stringify(response.data.admin));
      } else {
        setError('Неверное имя или пароль');
      }
      dispatch(login());
      navigate('/app/home');
    } catch (error) {
      console.error('Ошибка при отправке данных:', error);
      setError('Ошибка при попытке входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">Вход</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {loading && <p>Отправка данных...</p>}

        <div className="mb-4 relative">
          <FaUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Введите имя"
            required
            className="border rounded-full p-3 pl-12 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4 relative">
          <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2  text-yellow-50" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
            className="border rounded-full p-3 pl-12 w-full  text-yellow-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          className="bg-blue-500 hover:bg-blue-600 transition duration-300 text-white font-semibold py-3 px-6 rounded-full w-full shadow-lg"
          onClick={handleLogin}
          disabled={loading}
        >
          Войти
        </button>
      </div>
    </div>
  );
};

export default Login;
