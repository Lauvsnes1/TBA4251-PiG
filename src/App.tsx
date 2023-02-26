import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import BaseMap from './components/baseMap';
import MainPage from './components/mainPage';
import StrollyMap from './components/strollyMap';

function App() {
  return (
    <div id="root" className='App'> 
    <MainPage/>
    </div>
      
  );
}

export default App;
