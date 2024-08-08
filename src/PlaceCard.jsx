import React from 'react';

const PlaceCard = ({ place }) => {
  return (
    <div className="bg-white rounded-md shadow-md p-4">
      <h2 className="text-black text-lg font-bold">{place.englishName}</h2>
      <p className="text-gray-600">{place.banglaName}</p>
      <p className="text-gray-600">{place.description}</p>
      <p className="text-gray-600">
        {place.phoneNumbers.map((number, index) => (
          <span href='tel:' className='' key={index}>
            {/* {number} */}
            <a href='tel:' className='text-blue-500 hover:underline'>{number}</a>{index < place.phoneNumbers.length - 1 ? ', ' : ''}
          </span>
        ))}
      </p>
    </div>
  );
};

export default PlaceCard;