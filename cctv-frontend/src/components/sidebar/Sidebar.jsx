import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FiHome, FiCamera, FiArchive, FiPlus, FiLogOut } from 'react-icons/fi';

const Sidebar = () => {
  const location = useLocation();
  const hideOnRoutes = ['/', '/login', '/signup'];

  if (hideOnRoutes.includes(location.pathname)) return null;

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-300 
     ${isActive ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`;

  return (
    <aside className="hidden md:block fixed left-0 top-0 h-screen w-64 bg-white shadow-lg p-6 z-20 overflow-y-auto border-r border-gray-200">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-blue-600 tracking-tight">Smart CCTV</h1>
      </div>

      <nav className="flex flex-col space-y-2">
        <NavLink to="/dashboard" className={navItemClass}>
          <FiHome size={18} /> <span>Dashboard</span>
        </NavLink>
        <NavLink to="/cameras" className={navItemClass}>
          <FiCamera size={18} /> <span>Cameras</span>
        </NavLink>
        <NavLink to="/add-camera" className={navItemClass}>
          <FiPlus size={18} /> <span>Add Camera</span>
        </NavLink>
        <NavLink to="/footage-archive" className={navItemClass}>
          <FiArchive size={18} /> <span>Archive</span>
        </NavLink>
        <NavLink to="/logout" className={navItemClass}>
          <FiLogOut size={18} /> <span>Logout</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
