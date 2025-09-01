import React from 'react'
import mensCollectionImage from "../../assets/mens-collection.webp";
import womensCollectionImage from "../../assets/womens-collection.webp";
import topWearCollectionImage from "../../assets/login.webp";
import bottomWearCollectionImage from "../../assets/featured.webp";
import { Link } from "react-router-dom";

const collections = [
  {
    name: "Women's Collection",
    image: womensCollectionImage,
    link: "/collections/all?gender=Women",
  },
  {
    name: "Men's Collection",
    image: mensCollectionImage,
    link: "/collections/all?gender=Men",
  },
  {
    name: "Top Wear Collection",
    image: topWearCollectionImage,
    link: "/collections/all?category=Top%20Wear",
  },
  {
    name: "Bottom Wear Collection",
    image: bottomWearCollectionImage,
    link: "/collections/all?category=Bottom%20Wear",
  },
];

const GenderCollectionSection = () => {
  return (
    <section className="py-16 px-4 lg:px-0">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {collections.map((col, idx) => (
          <div key={col.name} className="relative flex-1 group rounded-2xl shadow-lg overflow-hidden">
            <img
              src={col.image}
              alt=""
              onError={e => e.target.style.display = 'none'}
              className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition duration-300 flex flex-col items-center justify-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 drop-shadow-lg text-center">{col.name}</h2>
              <Link
                to={col.link}
                className="inline-block bg-black bg-opacity-80 text-white px-6 py-2 text-base font-semibold rounded-full shadow hover:bg-opacity-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white"
              >
                Shop Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GenderCollectionSection;
