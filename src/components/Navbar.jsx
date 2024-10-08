import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa'; // Импортируем иконки

import Logout from "./Logout";
import Create from './Create';

const Navbar = ({ toggleTheme, theme }) => {
    return (
        <div className="navbar bg-base-300 shadow-md px-4 py-2">
            <div className="flex-1 flex items-center">
                <a className="btn btn-ghost text-xl font-bold text-white hover:text-blue-300 transition duration-300">oilTrade.uz</a>
                <img 
                    src="https://oiltrade.uz/templates/oiltrade/images/logo1.png" 
                    alt="Логотип oilTrade" 
                    className="h-10 ml-4" 
                />
            </div>
            <li className=' mr-5'>
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
                {theme === 'light' ? <FaMoon size={24} /> : <FaSun size={24} />} {/* Иконка переключения */}
            </div>
        </div>
    );
};

export default Navbar;
