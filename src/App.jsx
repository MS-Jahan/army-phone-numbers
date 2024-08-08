// App.jsx
import React, { useState, useEffect } from 'react';
import { useGeolocation } from 'react-use';
import SearchInput from './SearchInput';
import LocationPermissionMessage from './LocationPermissionMessage';
import PlaceCard from './PlaceCard';
import GitHubLogo from './github-logo.svg'; // assuming you have a GitHub logo SVG in your project


const App = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [locationPermission, setLocationPermission] = useState(null);
  const { latitude, longitude, error } = useGeolocation();

  useEffect(() => {
    // Fetch data from the JSON file
    fetch('/data.json')
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  useEffect(() => {
    // Check location permission on component mount
    navigator.geolocation.getCurrentPosition(
      () => setLocationPermission(true),
      () => setLocationPermission(false)
    );
  }, []);

  useEffect(() => {
    // Update the search input field with the current location
    if (latitude && longitude) {
      setSearchText(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
    }
  }, [latitude, longitude]);

  const requestLocationPermission = () => {
    navigator.geolocation.getCurrentPosition(
      () => setLocationPermission(true),
      () => setLocationPermission(false)
    );
  };

  const generateRandomNumber = () => {
    return Math.floor(Math.random() * 10000000000) + 1;
  };

  let filteredData = data;
  console.log("lat, lon:", latitude, longitude)
  if (!latitude || !longitude) {
    filteredData = data.filter(item =>
      item.englishName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.banglaName.toLowerCase().includes(searchText.toLowerCase())
      // ||
      // (latitude && longitude && item.location.latitude.toFixed(4) === latitude.toFixed(4) && item.location.longitude.toFixed(4) === longitude.toFixed(4))
    );
  }

  const sortedData = filteredData.sort((a, b) => {
    if (latitude && longitude) {
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
    return 0;
  });

  return (
    <div className="relative flex flex-col items-center container mx-auto py-20 px-5">
      <h1 className="text-3xl font-bold mb-4 text-center">সেনাবাহিনীর ক্যাম্পসমূহের সাথে যোগাযোগের নম্বর</h1>
      <div className="w-full max-w-md">
        <SearchInput searchText={searchText} setSearchText={setSearchText} />
      </div>
      <LocationPermissionMessage locationPermission={locationPermission} requestLocationPermission={requestLocationPermission} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {sortedData.map(place => (
          <PlaceCard key={place.englishName + generateRandomNumber()} place={place} />
        ))}
      </div>
      {/* Add GitHub logo with absolute positioning */}
      <a
        href="https://github.com/your-username/your-repo"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-4 right-4"
      >
        <img src={GitHubLogo} alt="GitHub Repo" className="w-10 h-10" />
      </a>
    </div>
  );
};

export default App;