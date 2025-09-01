import React, { useState } from 'react';
import { HiMagnifyingGlass, HiMiniXMark } from 'react-icons/hi2';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const categorySuggestions = ["Top Wear", "Bottom Wear"];
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleSearchToggle = () => {
        setIsOpen(!isOpen);
    }
    
    const handleSearch = (e) => {
        e.preventDefault();
        const trimmed = searchTerm.trim().toLowerCase();
        if (trimmed === "top wear" || trimmed === "bottom wear") {
            navigate(`/collections/all?category=${encodeURIComponent(searchTerm.trim())}`);
        } else {
            navigate(`/collections/all?search=${searchTerm}`);
        }
        setIsOpen(false);
    }

    const handleCategorySuggestion = (cat) => {
        setShowSuggestions(false);
        setIsOpen(false);
        navigate(`/collections/all?category=${encodeURIComponent(cat)}`);
    };

    return (
        <div className={`flex items-center justify-center w-full transition-all duration-300 ${
            isOpen ? "absolute top-0 left-0 w-full bg-white h-24 z-50" : "w-auto"
        }`}>
            {isOpen ? 
            (
                <form onSubmit={handleSearch}
                 className="relative flex items-center justify-center w-full">
                    <div className="relative w-1/2">
                        <input 
                            type="text" 
                            placeholder="Search by name, description, or category..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => setShowSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                            className="bg-gray-100 px-4 py-2 pl-2 pr-12 rounded-lg focus:outline-none w-full placeholder:text-gray-700"
                        />
                        {/*search icon */}
                        <button typ="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800">
                            <HiMagnifyingGlass className=" h-6 w-6"/>
                        </button>
                        {/* Suggestions dropdown */}
                        {showSuggestions && searchTerm === "" && (
                            <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow z-10">
                                {categorySuggestions.map((cat) => (
                                    <div
                                        key={cat}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                                        onMouseDown={() => handleCategorySuggestion(cat)}
                                    >
                                        {cat}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/*close button */}
                    <button type="button"
                    onClick={handleSearchToggle}
                     className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800">
                        <HiMiniXMark className=" h6 w-6" />
                    </button>
                </form>
            ) : (
                <button onClick={handleSearchToggle}>
                    <HiMagnifyingGlass className="h-6 w-6" />
                </button>
            )}
        </div>
    )
}

export default SearchBar;