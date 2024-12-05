import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import './MapPage.css';

const MapsPage = () => {
  const mapRef = useRef(null);
  const [locations, setLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [routingControl, setRoutingControl] = useState(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView([51.505, -0.09], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
    }

    fetchLocations();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/locations');
      const data = await response.json();
      setLocations(data);
      data.forEach(location => addMarker(location));
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const addLocation = async (lat, lng, name) => {
    try {
      const response = await fetch('http://localhost:5001/api/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, lat, lng }),
      });
      const newLocation = await response.json();
      setLocations([...locations, newLocation]);
      addMarker(newLocation);
    } catch (error) {
      console.error('Error adding location:', error);
    }
  };

  const addMarker = (location) => {
    const marker = L.marker([location.lat, location.lng]).addTo(mapRef.current);
    marker.bindPopup(`<b>${location.name}</b><br>Lat: ${location.lat}<br>Lng: ${location.lng}`);
  };

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    const name = `Location ${locations.length + 1}`;
    addLocation(lat, lng, name);
  };

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.on('click', handleMapClick);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.off('click', handleMapClick);
      }
    };
  }, [locations]);

  const searchLocation = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/search?query=${encodeURIComponent(searchQuery)}`);
      const results = await response.json();
      if (results.length > 0) {
        const { lat, lon, display_name } = results[0];
        mapRef.current.setView([lat, lon], 13);
        addLocation(lat, lon, display_name);
        setSearchQuery('');
      }
    } catch (error) {
      console.error('Error searching location:', error);
    }
  };

  const getDirections = async (start, end) => {
    try {
      const response = await fetch(`http://localhost:5001/api/directions?start=${start.lng},${start.lat}&end=${end.lng},${end.lat}`);
      const data = await response.json();

      if (routingControl) {
        mapRef.current.removeControl(routingControl);
      }

      const newRoutingControl = L.Routing.control({
        waypoints: [
          L.latLng(start.lat, start.lng),
          L.latLng(end.lat, end.lng)
        ],
        router: L.Routing.osrmv1({
          serviceUrl: `http://router.project-osrm.org/route/v1`,
          profile: 'driving'
        }),
        lineOptions: {
          styles: [{ color: '#6FA1EC', weight: 4 }]
        },
        showAlternatives: true,
        fitSelectedRoutes: true,
        show: false
      }).addTo(mapRef.current);

      setRoutingControl(newRoutingControl);
    } catch (error) {
      console.error('Error getting directions:', error);
    }
  };

  return (
    <div className="maps-container">
      <div className="sidebar">
        <h2>Interactive Map</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for a location"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={searchLocation}>Search</button>
        </div>
        <div className="locations-list">
          <h3>Saved Locations</h3>
          {locations.map((location) => (
            <div key={location._id} className="location-item">
              <span>{location.name}</span>
              <button onClick={() => mapRef.current.setView([location.lat, location.lng], 13)}>
                View
              </button>
            </div>
          ))}
        </div>
        {locations.length >= 2 && (
          <div className="directions-container">
            <h3>Get Directions</h3>
            <select onChange={(e) => {
              const [startId, endId] = e.target.value.split(',');
              const start = locations.find(l => l._id === startId);
              const end = locations.find(l => l._id === endId);
              if (start && end) {
                getDirections(start, end);
              }
            }}>
              <option value="">Select start and end points</option>
              {locations.map((start) => (
                locations.filter(l => l._id !== start._id).map((end) => (
                  <option key={`${start._id},${end._id}`} value={`${start._id},${end._id}`}>
                    {start.name} to {end.name}
                  </option>
                ))
              ))}
            </select>
          </div>
        )}
      </div>
      <div id="map" className="map-container"></div>
    </div>
  );
};

export default MapsPage;

