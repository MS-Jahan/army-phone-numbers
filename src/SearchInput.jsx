import React from 'react';

const SearchInput = ({ searchText, setSearchText }) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        className="border border-gray-300 rounded-md px-4 py-2 w-full"
        placeholder="Search by name or location"
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;