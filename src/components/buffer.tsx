import React, { useState, ChangeEvent, } from 'react';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import { FeatureCollection } from 'geojson';
import { useGeoJSONContext, GeoJSONItem} from '../context/geoJSONContext';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { uid } from 'uid';
import buffer from '@turf/buffer';

function Buffer(props: { handleCloseModal: () => void;}) {
  const [selectedLayer, setSelectedLayer] = useState<GeoJSONItem>()
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

  const handleBuffer = () => {
    const buffered = buffer(selectedLayer?.geoJSON as FeatureCollection, bufferRadius, {units: 'meters'})
    return buffered;
  }

  const handleOk = () => {
    const buffered = handleBuffer();
    const newObj: GeoJSONItem = {
        id: uid(),
        name: name, 
        visible: true,
        color: getRandomColor(),
        geoJSON: buffered
      }
    setGeoJSONList((prevGeoJSONs: GeoJSONItem[]) => [...prevGeoJSONs, newObj as GeoJSONItem])
    //pass state up to close modal
    props.handleCloseModal()
    
  }
  const handleChoseLayer = (event: ChangeEvent<HTMLInputElement>) => {
    const chosenLayer: GeoJSONItem | undefined = geoJSONList.find((layer) => layer.id === event.target.value);
    setSelectedLayer(chosenLayer);
  }

  return (
    <div style={{display: "flex", flexDirection: "column",  justifyContent: "center", flexWrap: 'wrap', width: '100%' }}>
        <Typography variant="h6"> Buffer Tool:</Typography>
      
        <TextField
          style={{paddingTop: '10px'}}
          id="Selected-buffer-layer"
          select
          label="Select layer"
          onChange={handleChoseLayer}
          variant="filled"
        >
          {geoJSONList.map((layer) => (
            <MenuItem key={layer.id} value={layer.id} >
              {layer.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="outlined-error"
          label="Buffer radius in m"
          onChange={(e) => handleBufferSelect(e)}
          style={{paddingTop: '10px'}}
          variant="filled"
          type='number'
        
        />
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
export default Buffer;