import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { geoJSONList } from '../data/test_data';

const accessToken: string|any = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
mapboxgl.accessToken = accessToken;



function StrollyMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) {
      return;
    }

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [10.421906, 63.446827],
      zoom: 12
    });

    map.on('load', () => {
      // The map style is now fully loaded
      for(const item of geoJSONList){
        const {type, data } = item
      map.addSource('my-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [10.421906, 63.446827]
              },
              properties: {
                title: 'My Marker',
                description: 'This is my marker',
              },
            }
          ]
        }
      });

      map.addLayer({
        id: 'my-layer',
        type: 'circle',
        source: 'my-source',
        paint: {
          'circle-radius': 6,
          'circle-color': '#B42222'
        }
      });
    }

      setMap(map);
    });

    return () => {
      map.remove();
    };
  }, [mapContainer]);

  return (
    <div
      ref={mapContainer}
      className="map-container"
      style={{
        position: 'absolute',
        top: '0',
        bottom: '0',
        width: '100vw',
        height: '100vh',
        border: 3,
        borderRadius: 8,
        borderColor: 'primary.main'
      }}
    />
  );
}

export default StrollyMap;
