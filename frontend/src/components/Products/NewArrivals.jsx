import React, { useRef, useState, useEffect } from 'react'
import { FiChevronLeft } from 'react-icons/fi';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import axios from 'axios';

const NewArrivals = () => {
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const [newArrivals, setNewArrivals] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNewArrivals = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/new-arrivals`);
                setNewArrivals(response.data);
                setError(null);
            } catch (error) {
                setError(error.response?.data || error.message || error);
            }
        };
        fetchNewArrivals();
    }, []);

    const getErrorMessage = (error) => {
        if (!error) return null;
        if (typeof error === 'string') return error;
        if (typeof error === 'object' && error.message) return error.message;
        try {
            return JSON.stringify(error);
        } catch {
            return 'Unknown error';
        }
    };

    const scroll = (direction) => {
        const scrollAmount = direction === "left" ? -300 : 300;
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    //update scroll buttons
    const updtaeScrollButtons = () => {
        const container = scrollRef.current;
        if (container) {
            const leftScroll = container.scrollLeft;
            const rightScrollable = container.scrollWidth > leftScroll + container.clientWidth;

            setCanScrollLeft(leftScroll > 0);
            setCanScrollRight(rightScrollable);
        }

        console.log({
            scrollLeft: container.scrollLeft,
            clientWidth: container.clientWidth,
            containerScrollWidth: container.scrollWidth,
        });
    };

    useEffect(() => {
        const container = scrollRef.current;
        if (container) {
            container.addEventListener("scroll", updtaeScrollButtons);
            updtaeScrollButtons();
        }
    }, [newArrivals]);

    return (
        <section className="relative">
            <div className="container mx-auto text-center mb-6 relative">
                <h2 className="text-3xl font-bold mb-4">Explore Best Deals</h2>
                <p className="text-lg text-gray-600 mb-4">Explore the best deals from our collection of stylish and maintained products.</p>
                {error && (
                    <p className="text-red-500">{getErrorMessage(error)}</p>
                )}
            </div>

            {/* Scroll Buttons */}
            <div className="absolute inset-y-0 w-full flex justify-between items-center pointer-events-none z-10">
                <div className="pl-4 pointer-events-auto">
                    <button
                        onClick={() => scroll("left")}
                        disabled={!canScrollLeft}
                        className={`p-2 rounded border transition-all duration-300 
                            ${canScrollLeft 
                                ? "bg-white text-black shadow hover:scale-110" 
                                : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                            }`}
                    >
                        <FiChevronLeft className="text-2xl" />
                    </button>
                </div>
                <div className="pr-4 pointer-events-auto">
                    <button
                        onClick={() => scroll("right")}
                        disabled={!canScrollRight}
                        className={`p-2 rounded border transition-all duration-300 
                            ${canScrollRight 
                                ? "bg-white text-black shadow hover:scale-110" 
                                : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                            }`}
                    >
                        <FiChevronRight className="text-2xl" />
                    </button>
                </div>
            </div>

            {/*scrollable content */}
            <div
                ref={scrollRef}
                className="container mx-auto overflow-x-scroll flex space-x-6 relative scroll-smooth"
            >
                {newArrivals.map((product) => {
                    return (
                        <div key={product._id} className="min-w-[100%] sm:min-w-[50%] lg:min-w-[30%] relative">
                            <img
                                src={product.images[0]?.url}
                                alt=""
                                onError={e => e.target.style.display = 'none'}
                                className="w-full h-[500px] object-cover rounded-lg"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-opacity-50 backdrop-blur-md text-white p-4 rounded-b-lg">
                                <Link to={`/product/${product._id}`} className="block">
                                    <h4 className="font-medium">{product.name}</h4>
                                    <p className="mt-1">${product.price}</p>
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default NewArrivals;
