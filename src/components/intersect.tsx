import React, { useState, ChangeEvent } from 'react';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import { useGeoJSONContext, GeoJSONItem } from '../context/geoJSONContext';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { uid } from 'uid';
import intersect from '@turf/intersect';

function Intersect(props: { handleCloseModal: () => void; }) {
  const [selectedLayer1, setSelectedLayer1] = useState<GeoJSONItem>();
  const [selectedLayer2, setSelectedLayer2] = useState<GeoJSONItem>();
  const [name, setName] = useState<string>('');

  const { geoJSONList, setGeoJSONList } = useGeoJSONContext();

  function getRandomColor(): string {
    const hexChars = '0123456789ABCDEF';
    let hexColor = '#';

    // generate a random hex color code
    for (let i = 0; i < 6; i++) {
      hexColor += hexChars[Math.floor(Math.random() * 16)];
    }

    return hexColor;
  }

//   function handleIntersection() {
//     const intersections: FeatureCollection = {
//         type: 'FeatureCollection',
//         features: [],
//       };
//       console.log("length of polygons list:", selectedLayer1?.geoJSON.features.length, selectedLayer2?.geoJSON.features.length )
//     if(selectedLayer1?.geoJSON && selectedLayer2?.geoJSON){
//     for (let i = 0; i < (selectedLayer1?.geoJSON.features.length); i++){
//         for (let j = 0; j< (selectedLayer2?.geoJSON.features.length); j++){
//     if (
//       selectedLayer1?.geoJSON.features[i].geometry.type === "Polygon" &&
//       selectedLayer2?.geoJSON.features[j].geometry.type === "Polygon"
//     ) {
//       const intersection = intersect(
//         selectedLayer1.geoJSON.features[i].geometry as Polygon,
//         selectedLayer2.geoJSON.features[j].geometry as Polygon
//       ) as Feature<Polygon | MultiPolygon>;
//       if (intersection === undefined) {
//         console.log('error')
//         return null;
//       }
//       if(intersection !== null){ 
//       intersections.features.push(intersection)
//       }
  
//     }
//     }
//     };
//     return intersections;
// }
//   }

function handleIntersection() {
  const intersections: FeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  };
  console.log("length of polygons list:", selectedLayer1?.geoJSON.features.length, selectedLayer2?.geoJSON.features.length )
  if (selectedLayer1?.geoJSON && selectedLayer2?.geoJSON) {
    for (let i = 0; i < selectedLayer1.geoJSON.features.length; i++) {
      for (let j = 0; j < selectedLayer2.geoJSON.features.length; j++) {
        if (selectedLayer1.geoJSON.features[i].geometry.type === "Polygon" &&
            selectedLayer2.geoJSON.features[j].geometry.type === "Polygon") {
          const intersection = intersect(
            selectedLayer1.geoJSON.features[i].geometry as Polygon,
            selectedLayer2.geoJSON.features[j].geometry as Polygon
          ) as Feature<Polygon | MultiPolygon>;
          if (intersection) {
            const feature1 = selectedLayer1.geoJSON.features[i];
            const feature2 = selectedLayer2.geoJSON.features[j];
            const intersectionFeature: Feature<Polygon | MultiPolygon> = {
              type: 'Feature',
              properties: {...feature1.properties, ...feature2.properties}, // combine properties from both input features
              geometry: intersection.geometry,
            };
            intersections.features.push(intersectionFeature);
          }
        }
      }
    }
  }
  return intersections;
}


  const handleOk = () => {
    const intersected = handleIntersection();
    const newObj: GeoJSONItem = {
      id: uid(),
      name: name,
      visible: true,
      color: getRandomColor(),
      opacity: 0.5,
      geoJSON: intersected as FeatureCollection,
    };
    console.log('the list:', geoJSONList)
    console.log('the new obj', newObj)
    setGeoJSONList((prevGeoJSONs: GeoJSONItem[]) => [...prevGeoJSONs, newObj as GeoJSONItem]);
    //pass state up to close modal
    props.handleCloseModal();
  };

  const handleChoseLayer1 = (event: ChangeEvent<HTMLInputElement>) => {
    const chosenLayer: GeoJSONItem = geoJSONList.find((layer) => layer.id === event.target.value) as GeoJSONItem;
    setSelectedLayer1(chosenLayer);
  };

  const handleChoseLayer2 = (event: ChangeEvent<HTMLInputElement>) => {
    const chosenLayer: GeoJSONItem = geoJSONList.find((layer) => layer.id === event.target.value) as GeoJSONItem;
    setSelectedLayer2(chosenLayer);
  };

  return (
    <div style={{display: "flex", flexDirection: "column",  justifyContent: "center", flexWrap: 'wrap', width: '100%' }}>
        <Typography variant="h6"> Intersect Tool:</Typography>
      
        <TextField
          style={{paddingTop: '10px'}}
          id="Selected-buffer-layer"
          select
          label="Select layer one"
          onChange={handleChoseLayer1}
          variant="filled"
          defaultValue={""}
        >
          {geoJSONList.map((layer) => (
            <MenuItem key={layer.id} value={layer.id} >
              {layer.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          style={{paddingTop: '10px'}}
          id="Selected-buffer-layer"
          select
          label="Select layer two"
          onChange={handleChoseLayer2}
          variant="filled"
          defaultValue={""}
        >
          {geoJSONList.map((layer) => (
            <MenuItem key={layer.id} value={layer.id} >
              {layer.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          required
          id="outlined-required"
          label="Name of output layer"
          onChange={(e) => setName(e.target.value)}
          style={{paddingTop: '10px'}}
          variant="filled"
        />
      <div style={{flexDirection: 'row', justifyContent: 'space-around', display: 'flex', paddingTop: '10px'}}>
      <Button variant="outlined" color="error" onClick={props.handleCloseModal}>Cancel</Button>
      <Button onClick={handleOk} variant="outlined">OK</Button>
      </div>
    </div>
    
  );
}
export default Intersect;

