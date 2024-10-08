import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBullhorn, FaClipboardList, FaNewspaper, FaHome, FaBoxOpen, FaListAlt, FaShoppingCart } from 'react-icons/fa';
import { BiSolidDiscount } from "react-icons/bi";
import { AiOutlineAppstore } from "react-icons/ai"; // Новая иконка
import Logout from "./Logout";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="drawer lg:drawer-open bg-base-300 w-full lg:w-2/12 shadow-lg">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center justify-center">
        <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">
          Open drawer
        </label>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu text-base-content min-h-full w-full p-4 gap-5">
          <li>
            <Link
              to="/app/home" 
              className={`flex items-center gap-4 py-2 px-5 rounded-lg transition-all duration-300 ${
                location.pathname === "/"
                  ? "bg-primary text-white shadow-md"
                  : "hover:bg-primary hover:text-white"
              }`}
            >
              <FaHome size={20} /> Home
            </Link>
          </li>
          <li>
            <Link
              to="/app/products" 
              className={`flex items-center gap-4 py-2 px-5 rounded-lg transition-all duration-300 ${
                location.pathname === "/products"
                  ? "bg-primary text-white shadow-md"
                  : "hover:bg-primary hover:text-white"
              }`}
            >
              <FaBoxOpen size={20} /> Products
            </Link>
          </li>
          
          <li>
            <Link
              to="/app/applications" 
              className={`flex items-center gap-4 py-2 px-5 rounded-lg transition-all duration-300 ${
                location.pathname === "/applications"
                  ? "bg-primary text-white shadow-md"
                  : "hover:bg-primary hover:text-white"
              }`}
            >
              <FaClipboardList size={20} /> Applications
            </Link>
          </li>
          <li>
            <Link
              to="/app/news" 
              className={`flex items-center gap-4 py-2 px-5 rounded-lg transition-all duration-300 ${
                location.pathname === "/news"
                  ? "bg-primary text-white shadow-md"
                  : "hover:bg-primary hover:text-white"
              }`}
            >
              <FaNewspaper size={20} /> News
            </Link>
          </li>
          <li>
            <Link
              to="/app/advertising" 
              className={`flex items-center gap-4 py-2 px-5 rounded-lg transition-all duration-300 ${
                location.pathname === "/advertising"
                  ? "bg-primary text-white shadow-md"
                  : "hover:bg-primary hover:text-white"
              }`}
            >
              <FaBullhorn size={20} /> Advertising
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
