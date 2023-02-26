import React, { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';


mapboxgl.accessToken =
    'pk.eyJ1IjoibGF1dnNuZXMxIiwiYSI6ImNsZWl4ZzQ3ZjA0ZzYzcm51em0wNmxvcTUifQ.9TpjxrT5CFvtDZzuP9QzQA';

function StrollyMap() {
    const mapContainer = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState(null);
    const [lng, setLng] = useState(10.421906);
    const [lat, setLat] = useState(63.446827);
    const [zoom, setZoom] = useState(12);

    useEffect(() => {
        const attachMap = (
            //setMap: React.Dispatch<React.SetStateAction<any>>,
            setMap: (value: any | null) => void,
            mapContainer: React.RefObject<HTMLDivElement>,
        ) => {
            if (!mapContainer.current) {
                return;
            }
            const map = new mapboxgl.Map({
                container: "map",
                style: 'mapbox://styles/mapbox/light-v10',
                center: [lng, lat],
                zoom: zoom,
            });
            setMap(map);
        };

        !map && attachMap(setMap, mapContainer);
    }, [map]);

    return ( <div
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
        borderColor: 'primary.main',
    
    }}/>)


}
export default StrollyMap