import React, { useState } from 'react';
import {FaBoxOpen, FaClipboardList, FaStore, FaUser, FaSignOutAlt, FaHome} from "react-icons/fa";
import {Link} from "react-router-dom";
import {useNavigate, NavLink} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/slices/authSlice';
import { clearCart } from '../../redux/slices/cartSlice';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearCart());
    navigate("/");
  }
  return (
    <div className="p-6 bg-gray-900 h-full"> {/* Added bg-gray-900 and h-full */}
      <div className="mb-6">
        <Link to="/admin" className="text-2xl font-medium text-white">Thrifter</Link> {/* Added text-white */}
      </div>
      <h2 className="text-xl font-medium mb-6 text-center text-white">Admin Dashboard</h2> {/* Added text-white */}

      <nav className="flex flex-col space-y-2">
        <NavLink to="/admin" className={({isActive})=>isActive ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
        : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"}>
          <FaHome />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/admin/users" className={({isActive})=>isActive ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
        : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"}>
          <FaUser />
          <span>Users</span>
        </NavLink>
        <NavLink to="/admin/products" className={({isActive})=>isActive ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
        : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"}>
          <FaBoxOpen />
          <span>Products</span>
        </NavLink>
        <NavLink to="/admin/products/create" className={({isActive})=>isActive ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
        : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"}>
          <FaBoxOpen />
          <span>Create Product</span>
        </NavLink>
        <NavLink to="/admin/orders" className={({isActive})=>isActive ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
        : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"}>
          <FaClipboardList />
          <span>Orders</span>
        </NavLink>
        <NavLink to="/" className={({isActive})=>isActive ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
        : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"}>
          <FaStore />
          <span>Shop</span>
        </NavLink>
      </nav>
      <div className="mt-6">
        <button onClick={handleLogout} className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center justify-center space-x-2">
          <FaSignOutAlt />
          <span>LogOut</span>
        </button>
      </div>
    </div>
  )
}

export default AdminSidebar;