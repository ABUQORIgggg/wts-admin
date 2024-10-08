import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Products from './pages/Products';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { useSelector } from 'react-redux';

function App() {
  const store = useSelector((store) => store);
  console.log(store);

  const [theme, setTheme] = useState('dark');

  const appStyle = {
    background: theme === 'light' 
      ? 'linear-gradient(to bottom, #b3e0ff, #e6f7ff)' 
      : 'linear-gradient(to bottom, #003366, #0066cc)', 
    color: theme === 'light' ? '#333' : '#f0f0f0',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    transition: 'background 0.5s ease, color 0.5s ease', 
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div style={appStyle}>
      <Navbar toggleTheme={toggleTheme} theme={theme} /> {/* Передаем пропсы в Navbar */}
      <div className="flex">
        <Sidebar />
        <Outlet />
      </div>
      <button>logout</button>
    </div>
  );
}

export default App;
