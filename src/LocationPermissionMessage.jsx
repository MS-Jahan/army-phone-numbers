// LocationPermissionMessage.jsx
import React from 'react';

const LocationPermissionMessage = ({ locationPermission, requestLocationPermission }) => {
    console.log("locationPermission", locationPermission);
    if (locationPermission === null) {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
        <p>Please allow access to your location to get the nearest places.</p>
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded mt-2"
          onClick={requestLocationPermission}
        >
          Allow Location Access
        </button>
      </div>
    );
  }

  if (locationPermission === false) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
        <p>Location access denied. You can still search by name or location coordinates.</p>
      </div>
    );
  }

  return null;
};

export default LocationPermissionMessage;