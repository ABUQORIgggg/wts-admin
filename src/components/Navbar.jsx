import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa'; 

import Logout from "./Logout";
import Create from './Create';

const Navbar = ({ toggleTheme, theme }) => {
    return (
        <div className="navbar bg-base-300 shadow-md px-4 py-2">
            <div className="flex-1 flex items-center">
                <img 
                    src="/logo4.png" // Corrected path
                    alt="Логотип oilTrade" 
                    className="h-10 ml-4" 
                />
            </div>
            <li className='mr-5'>
                <Create />
            </li>
            <div className="flex-none">
                <ul className="menu menu-horizontal p-0 text-white">
                </ul>
            </div>
            <li>
                <Logout />
            </li>
            <div onClick={toggleTheme} className="text-white cursor-pointer ml-4 hover:text-blue-300 transition duration-300">
                {theme === 'light' ? <FaMoon size={24} /> : <FaSun size={24} />} 
            </div>
        </div>
    );
};

export default Navbar;
