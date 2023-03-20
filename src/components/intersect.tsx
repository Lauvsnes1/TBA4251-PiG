import React, { useState, ChangeEvent, } from 'react';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import { useGeoJSONContext, GeoJSONItem} from '../context/geoJSONContext';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { uid } from 'uid';
import intersect from '@turf/intersect';



function Intersect(props: { handleCloseModal: () => void;}) {
  const [selectedLayer1, setSelectedLayer1] = useState<GeoJSONItem>()
  const [selectedLayer2, setSelectedLayer2] = useState<GeoJSONItem>()
  const [name, setName] = useState<string>("")
  const [bufferRadius, setBufferRadius] = useState<number>(0)

  const { geoJSONList, setGeoJSONList } = useGeoJSONContext();

  function getRandomColor(): string {
    const hexChars = "0123456789ABCDEF";
    let hexColor = "#";
  
    // generate a random hex color code
    for (let i = 0; i < 6; i++) {
      hexColor += hexChars[Math.floor(Math.random() * 16)];
    }
  
    return hexColor;
  }
  const handleBufferSelect = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBufferRadius(Number(e.target.value));

  } 

  function handleIntersection() {
    // for (let i = 0; selectedLayer1?.geoJSON.features.length; i++){

    // }
    if (
      selectedLayer1?.geoJSON.features[0].geometry.type === "Polygon" &&
      selectedLayer2?.geoJSON.features[0].geometry.type === "Polygon"
    ) {
      const intersection = intersect(
        selectedLayer1.geoJSON.features[0].geometry as Polygon,
        selectedLayer2.geoJSON.features[0].geometry as Polygon
      ) as Feature<Polygon | MultiPolygon>;
      if (intersection === undefined) {
        console.log('error')
        return null;
      } 
  
      const featureCollection: FeatureCollection = {
        type: "FeatureCollection",
        features: [intersection]
      }
      return featureCollection;
    };
  }

  
  const handleOk = () => {
    const intersected = handleIntersection();
    const newObj: GeoJSONItem = {
        id: uid(),
        name: name, 
        visible: true,
        color: getRandomColor(),
        geoJSON: intersected as FeatureCollection
      }
    setGeoJSONList((prevGeoJSONs: GeoJSONItem[]) => [...prevGeoJSONs, newObj as GeoJSONItem])
    //pass state up to close modal
    props.handleCloseModal()
    
  }
  const handleChoseLayer1 = (event: ChangeEvent<HTMLInputElement>) => {
    const chosenLayer: GeoJSONItem = geoJSONList.find((layer) => layer.id === event.target.value) as GeoJSONItem;
    setSelectedLayer1(chosenLayer);
  }
  const handleChoseLayer2 = (event: ChangeEvent<HTMLInputElement>) => {
    const chosenLayer: GeoJSONItem = geoJSONList.find((layer) => layer.id === event.target.value) as GeoJSONItem;
    setSelectedLayer2(chosenLayer);
  }

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
