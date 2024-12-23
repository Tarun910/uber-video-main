import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  lat: -3.745,
  lng: -38.523,
};

const LiveTracking = () => {
  const [currentPosition, setCurrentPosition] = useState(defaultCenter);
  const [tracking, setTracking] = useState(false); // Control live tracking

  // Load Google Maps API with hook
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API,
  });

  useEffect(() => {
    let watchId;

    if (tracking) {
      if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentPosition({ lat: latitude, lng: longitude });
          },
          (error) => {
            console.error("Error getting geolocation: ", error);
            alert("Failed to get location. Please enable location services.");
          }
        );
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [tracking]);

  const handleStartTracking = () => {
    setTracking(true); // Start tracking on button click
  };

  return (
    <div style={{ textAlign: "center" }}>
      {!tracking && (
        <button onClick={handleStartTracking}>Start Live Tracking</button>
      )}

      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={currentPosition}
          zoom={15}
        >
          <Marker position={currentPosition} />
        </GoogleMap>
      ) : (
        <p>Loading map...</p>
      )}
    </div>
  );
};

export default LiveTracking;
