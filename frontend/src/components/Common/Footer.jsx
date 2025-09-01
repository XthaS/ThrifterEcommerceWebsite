import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from 'react-icons/io';
import { RiTwitterXLine } from "react-icons/ri";
import { FiPhoneCall } from "react-icons/fi";
import axios from 'axios';

const Footer = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/subscribers`, { email });
      setMessage("Subscribed successfully!");
      setEmail("");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Subscription failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="border-t py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 lg:px-0">
        {/* Newsletter Column - Add mb-8 for mobile spacing */}
        <div className="flex flex-col mb-8 md:mb-0">
          <h3 className="text-lg text-gray-800 mb-4">NEWSLETTER</h3>
          <p className="text-gray-500 mb-4">
            Be the first to know about sales and online offers.
          </p>
          <p className="font-medium text-sm text-gray-600 mb-6">
            Sign up and get 10% off your first order.
          </p>

          {/* Newsletter form - Add margin-top to button for mobile */}
          <form className="flex flex-col md:flex-row items-start md:items-center" onSubmit={handleSubscribe}>
            <input 
              type="email"
              placeholder="Enter your email"
              className="p-3 text-sm border border-green-400 border-r-0 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-400 transition-all w-full md:w-auto"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            /> 
            <button 
              type="submit" 
              className="bg-black text-white px-6 py-3 text-sm border border-black border-l-0 rounded-r-md hover:bg-gray-900 transition-all w-full md:w-auto"
              disabled={loading}
            >
                {loading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
          {message && (
            <p className={`mt-2 text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>
          )}
        </div>

        {/* Shop Links - Add pb-8 for extra bottom padding */}
        <div className="pb-8 md:pb-0">
          <h3 className="text-lg text-gray-800 mb-4">SHOP</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link to="/collections/all?gender=Men" className="hover:text-gray-600 transition-colors">Men</Link>
            </li>
            <li>
              <Link to="/collections/all?gender=Women" className="hover:text-gray-600 transition-colors">Women</Link>
            </li>
            <li>
              <Link to="/collections/all?category=Top Wear" className="hover:text-gray-600 transition-colors">Top Wear</Link>
            </li>
            <li>
              <Link to="/collections/all?category=Bottom Wear" className="hover:text-gray-600 transition-colors">Bottom Wear</Link>
            </li>
          </ul>
        </div>
          {/* Support Links */}
          <div>
          <h3 className="text-lg text-gray-800 mb-4">SUPPORT</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link to="#" className="hover:text-gray-600 transition-colors">CONTACT US</Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-600 transition-colors">ABOUT US</Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-600 transition-colors">FAQ's</Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-600 transition-colors">FEATURES</Link>
            </li>
          </ul>
        </div>

        {/* Follow us */}
        <div>
          <h3 className="text-lg text-gray-800 mb-4">FOLLOW US</h3>
          <div className="flex items-center space-x-4 mb-6">
            <a href="https://facebook.com/thrifterstore" target="_blank" rel="noopener noreferrer" className="hover:text-green-600">
              <TbBrandMeta className='h-5 w-5'/>
            </a>
            <a href="https://instagram.com/thrifterstore" target="_blank" rel="noopener noreferrer" className="hover:text-green-600">
              <IoLogoInstagram className='h-5 w-5'/>
            </a>
            <a href="https://twitter.com/thrifterstore" target="_blank" rel="noopener noreferrer" className="hover:text-green-600">
              <RiTwitterXLine className='h-4 w-4'/>
            </a>
          </div>
          <p className="text-gray-500">Call Us</p>
          <p>
            <FiPhoneCall className="inline-block mr-2" />
            0123-456-789
          </p>
        </div>
      </div>

      {/* footer bottom */}
      <div className="container mx-auto mt-12 px-4 lg:px-0 border-gray-200 pt-6">
        <p className="text-gray-500 text-sm tracking-tighter text-center">
          © 2025, Saban Shrestha. All Rights Reserved.
        </p>


      </div>
    </footer>
  );
};

export default Footer;