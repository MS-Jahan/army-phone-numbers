// App.jsx
import React, { useState, useEffect, useMemo } from 'react';
import SearchInput from './SearchInput';
import LocationPermissionMessage from './LocationPermissionMessage';
import PlaceCard from './PlaceCard';
import InstallPWAModal from './InstallPWAModal';

const App = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [locationPermission, setLocationPermission] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      let storedData = localStorage.getItem('armyData');
      
      if (storedData) {
        setData(JSON.parse(storedData));
      }

      if (isOnline) {
        try {
          const response = await fetch('/data.json');
          const fetchedData = await response.json();
          setData(fetchedData);
          localStorage.setItem('armyData', JSON.stringify(fetchedData));
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      } else if (!storedData) {
        setShowOfflineModal(true);
      }
    };

    fetchData();
  }, [isOnline]);

  useEffect(() => {
    // Check location permission on component mount
    navigator.geolocation.getCurrentPosition(
      () => setLocationPermission(true),
      () => setLocationPermission(false)
    );
  }, []);


  useEffect(() => {
    // check location permission
    if (navigator.geolocation) {
        requestLocationPermission();
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
    
  }, [latitude, longitude]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallModal(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
      });
    }
    setShowInstallModal(false);
  };

  const requestLocationPermission = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => setCoords(position),
      () => setLocationPermission(false)
    );
  };

  const setCoords = (position) => {
    // console.log("position :", position);
    setLatitude(position.coords.latitude);
    setLongitude(position.coords.longitude);
    setSearchText(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
  }

  const generateRandomNumber = () => {
    return Math.floor(Math.random() * 10000000000) + 1;
  };

  const getLatLongFromSearchText = (searchText) => {
    const latLongRegex = /(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/;
    const match = searchText.match(latLongRegex);
    if (match) {
      return {
        latitude: parseFloat(match[1]),
        longitude: parseFloat(match[2])
      };
    }
    return { latitude: null, longitude: null };
  };

  const filteredData = useMemo(() => {
    const { latitude, longitude } = getLatLongFromSearchText(searchText);
    if (!searchText || latitude || longitude) return data;
    return data.filter(item =>
      item.englishName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.banglaName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, data]);

  const sortedData = useMemo(() => {
    const { latitude, longitude } = getLatLongFromSearchText(searchText);
    return filteredData.sort((a, b) => {
      if (latitude !== null && longitude !== null) {
        const distanceA = Math.sqrt(
          Math.pow(a.location.latitude - latitude, 2) +
          Math.pow(a.location.longitude - longitude, 2)
        );
        const distanceB = Math.sqrt(
          Math.pow(b.location.latitude - latitude, 2) +
          Math.pow(b.location.longitude - longitude, 2)
        );

        return distanceA - distanceB;
      }
      return a.englishName.localeCompare(b.englishName);
    });
  }, [filteredData, searchText]);

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(setCoords);
      console.log("permission granted");
    } else {
      requestLocationPermission();
      console.log("permission denied");
    }
  };

  return (
    <div className="flex flex-col items-center container mx-auto py-20 px-5">
      <h1 className="text-3xl font-bold mb-4 text-center">সেনাবাহিনীর ক্যাম্পসমূহের সাথে যোগাযোগের নম্বর</h1>
      <div className="w-full max-w-md">
        <SearchInput searchText={searchText} setSearchText={setSearchText} handleLocationClick={handleLocationClick} />
      </div>
      <LocationPermissionMessage locationPermission={locationPermission} requestLocationPermission={requestLocationPermission} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {sortedData.map(place => (
          <PlaceCard key={place.englishName + generateRandomNumber()} place={place} />
        ))}
      </div>
      <a
        href="https://github.com/MS-Jahan/army-phone-numbers"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 absolute top-4 right-4"
      >
        <img src="https://github.com/fluidicon.png" alt="GitHub Repo" className="w-10 h-10" />
      </a>
      <footer className="mt-4 text-center">
        <p>Built with <span style={{ color: 'red' }}>❤️</span> by the students, for the people of Bangladesh</p>
      </footer>
      
      {showOfflineModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">No Internet Connection</h2>
            <p>Please connect to the internet to load the data.</p>
            <button 
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setShowOfflineModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <InstallPWAModal 
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        onInstall={handleInstall}
      />
    </div>
  );
};

export default App;