// SearchInput.jsx
import React from 'react';

const SearchInput = ({ searchText, setSearchText, handleLocationClick }) => {
  return (
    <div className="mb-4 flex items-center">
      <input
        type="text"
        className="border border-gray-300 rounded-md px-4 py-2 flex-1"
        placeholder="Search by name, location, or description"
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
      />
      <button
        className="ml-2 text-gray-500 hover:text-gray-700"
        onClick={handleLocationClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>
    </div>
  );
};

export default SearchInput;