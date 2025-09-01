import React from 'react';
import { Link } from 'react-router-dom';

const ProductGrid = ({ products, loading, error }) => {
  if (loading) {
    return <p>Loading...</p>
  }
  if (error) {
    return <p>Error: {error}</p>
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.isArray(products) && products.map((product, index) => {
        return (
          <Link key={index} to={`/product/${product._id}`} className="block group">
            <div className="bg-white p-4 rounded-xl shadow-md group-hover:shadow-xl transition-shadow duration-200">
              <div className="w-full h-72 mb-4 overflow-hidden rounded-lg">
                <img
                  src={product.images[0]?.url}
                  alt=""
                  onError={e => e.target.style.display = 'none'}
                  className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <h3 className="text-lg font-semibold mb-1 text-gray-800 truncate">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-2 truncate">{product.description}</p>
              <p className="text-green-700 font-bold text-base mb-2">${product.price}</p>
              {product.isAvailable ? (
                <p className="text-green-600 text-sm font-medium">✓ Available</p>
              ) : (
                <p className="text-red-500 text-sm font-medium">✗ Not Available</p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ProductGrid;
