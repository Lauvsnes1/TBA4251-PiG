import React, { useEffect, useRef } from 'react';
import mapboxgl, { CirclePaint, FillPaint, LinePaint } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useGeoJSONContext, GeoJSONItem } from '../context/geoJSONContext';

const accessToken: string | any = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
mapboxgl.accessToken = accessToken;

function StrollyMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { geoJSONList } = useGeoJSONContext();

  const determineType = (layer: GeoJSONItem): { type: string, paint?: mapboxgl.AnyPaint } => {
    const type = layer.geoJSON.features[0].geometry.type;
    switch (type) {
      case "Point":
        return {
          type: "circle",
          paint: {
            "circle-radius": 5,
            "circle-color": layer.color,
          },
        };
      case "LineString":
        return {
          type: "line",
          paint: {
            'line-color': layer.color,
            'line-width': 2,
          }
        };
      case "Polygon":
        return {
          type: "fill",
          paint: { 'fill-color': layer.color, 'fill-opacity': 0.5 }
        };
      default:
        throw new Error(`Unsupported geometry type: ${type}`);
    }
  };

  const determineVisibility = (layer: GeoJSONItem) => {
    return layer.visible ? 'visible' : 'none';
  }

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
      for (const layer of geoJSONList) {
        map.addSource(layer.id, {
          type: 'geojson',
          data: layer.geoJSON,
        });

        const { type, paint } = determineType(layer);

        switch (type) {
          case 'fill':
            map.addLayer({
              id: layer.name,
              type: type,
              source: layer.id,
              paint: paint as FillPaint,
            });
            break;
          case 'circle':
            map.addLayer({
              id: layer.name,
              type: type,
              source: layer.id,
              paint: paint as CirclePaint,
            });
            break;
          case 'line':
            map.addLayer({
              id: layer.name,
              type: type,
              source: layer.id,
              paint: paint as LinePaint,
            });
            break;
          default:
            throw new Error(`Unsupported layer type: ${type}`);
        }

        map.setLayoutProperty(layer.name, 'visibility', determineVisibility(layer));
      }
    });

    return () => {
      map.remove();

    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geoJSONList]);

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
