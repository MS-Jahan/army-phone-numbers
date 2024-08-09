// LocationPermissionMessage.jsx
import React, { useState } from 'react';

const LocationPermissionMessage = ({ locationPermission, requestLocationPermission }) => {
    const [showDeniedMessage, setShowDeniedMessage] = useState(false);

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

    if (locationPermission === false && showDeniedMessage) {
        return (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 relative">
                <p className='pt-5 pr-3'>Location access denied. You can still search by name or location coordinates.</p>
                <button
                    className="absolute top-2 right-2 ml-2 p-1 text-red-700 hover:text-red-900 bg-transparent"
                    onClick={() => setShowDeniedMessage(false)}
                    aria-label="Close message"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        );
    }

    return null;
};

export default LocationPermissionMessage;