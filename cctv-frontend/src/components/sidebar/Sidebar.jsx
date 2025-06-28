import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FiHome, FiCamera, FiArchive, FiPlus, FiLogOut } from 'react-icons/fi';

const Sidebar = () => {
  const location = useLocation();
  const hideOnRoutes = ['/', '/login', '/signup'];

  if (hideOnRoutes.includes(location.pathname)) {
    return null; // Don't render sidebar on home/login/signup
  }

  const navItemClass = ({ isActive }) =>
    `flex items-center px-4 py-3 rounded-lg hover:bg-blue-100 transition ${
      isActive ? 'bg-blue-200 font-semibold text-blue-800' : 'text-gray-700'
    }`;

  return (
    <aside className="w-64 bg-white shadow-lg h-screen fixed top-0 left-0 p-6 z-10">
      <h1 className="text-2xl font-extrabold text-blue-600 mb-10 tracking-tight">
        Smart CCTV
      </h1>
      <nav className="flex flex-col space-y-2">
        <NavLink to="/dashboard" className={navItemClass}>
          <FiHome className="mr-2" /> Dashboard
        </NavLink>
        <NavLink to="/cameras" className={navItemClass}>
          <FiCamera className="mr-2" /> Cameras
        </NavLink>
        <NavLink to="/add-camera" className={navItemClass}>
          <FiPlus className="mr-2" /> Add Camera
        </NavLink>
        <NavLink to="/footage-archive" className={navItemClass}>
          <FiArchive className="mr-2" /> Archive
        </NavLink>
        <NavLink to="/logout" className={navItemClass}>
          <FiLogOut className="mr-2" /> Logout
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
