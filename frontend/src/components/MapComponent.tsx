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

interface MapComponentProps {
  markers?: Array<{ lat: number; lng: number; id?: string }>;
  onMapClick?: (e: google.maps.MapMouseEvent) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
}

export default function MapComponent({ markers = [], onMapClick, center, zoom = 12 }: MapComponentProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
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
        />
      ))}
    </GoogleMap>
  );
}
