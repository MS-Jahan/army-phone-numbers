// App.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useGeolocation } from 'react-use';
import SearchInput from './SearchInput';
import LocationPermissionMessage from './LocationPermissionMessage';
import PlaceCard from './PlaceCard';
import GitHubLogo from './github-logo.svg';

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

        console.log("name:", a.englishName);
        console.log("distanceA", distanceA);
        console.log("distanceB", distanceB);
        console.log("distanceA - distanceB", distanceA - distanceB, "\n")

        return distanceA - distanceB;
      }
      return a.englishName.localeCompare(b.englishName);
    });
  }, [filteredData, searchText]);

  const setCoords = (position) => {
    console.log("position :", position);
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    setSearchText(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
  }

  const handleLocationClick = () => {
    // if permission granted
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
        className="mt-4"
      >
        <img src="/github-logo.svg" alt="GitHub Repo" className="w-10 h-10" />
      </a>
    </div>
  );
};

export default App;