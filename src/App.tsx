import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import BaseMap from './components/baseMap';
import Sidebar from './components/sidebarMenu';
import StrollyMap from './components/strollyMap';


// const Map = makeMap('root', center, zoom).then((map) => {
//   console.log(map)
// })



function App() {
  return (
    <div id="root" className='App'> 
    <Sidebar/>
    
    
    
    </div>
      
  );
}

export default App;
