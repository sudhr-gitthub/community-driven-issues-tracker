import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useCallback, useState } from 'react';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 40.730610, // Default to a central location (e.g. NYC) or user's location
  lng: -73.935242
};

const STATUS_COLORS = {
  'REPORTED': '#EF4444',    // Red
  'IN_PROGRESS': '#EAB308', // Yellow
  'RESOLVED': '#22C55E'     // Green
};

export default function MapComponent({ markers = [], onMapClick, center, zoom = 12 }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const [_map, setMap] = useState(null);

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (!isLoaded) {
    return <div className="h-100 d-flex align-items-center justify-content-center bg-light text-muted">Loading Map...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center || defaultCenter}
      zoom={zoom}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onClick={onMapClick}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      }}
    >
      {markers.map((marker, index) => (
        <Marker 
          key={marker.id || index}
          position={{ lat: marker.lat, lng: marker.lng }}
          icon={{
            path: window.google?.maps?.SymbolPath?.CIRCLE,
            fillColor: STATUS_COLORS[marker.status] || '#EF4444',
            fillOpacity: 0.9,
            scale: 7,
            strokeColor: 'white',
            strokeWeight: 2,
          }}
        />
      ))}
    </GoogleMap>
  );
}
