import React from 'react'
import heroImg from "../../assets/thrifter.webp";
import { Link } from 'react-router-dom';


const Hero = () => {
  return <section className="relative">
    <img src={heroImg} alt="Thrifter" className="w-full h-[400px] md:h-[600px] lg:h-[750px] object-cover" />
    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="text-center text-white p-6">
        <h1 className="text-4xl md:text-7xl font-light tracking-wide uppercase mb-4 drop-shadow-sm" style={{letterSpacing: '0.08em'}}>Thrifter</h1>
        <p className="text-lg md:text-xl font-light mb-8 opacity-90">Revamp Your Style on a Budget!</p>
        <Link to="/collections/all" className="inline-block bg-black text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:bg-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white">
          Shop Now
        </Link>
      </div>
    </div>
  </section>
};

export default Hero;
