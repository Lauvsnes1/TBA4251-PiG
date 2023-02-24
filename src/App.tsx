import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import BaseMap from './components/baseMap';
import StrollyMap from './components/strollyMap';
import "leaflet/dist/leaflet.css"

// const Map = makeMap('root', center, zoom).then((map) => {
//   console.log(map)
// })



function App() {
  return (
    <div id="map" className='App'  ><StrollyMap/></div>
      
  );
}

export default App;
