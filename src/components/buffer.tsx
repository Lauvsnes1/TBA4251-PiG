import React, { useState, ChangeEvent, } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { FeatureCollection } from 'geojson';
import { useGeoJSONContext, GeoJSONItem} from '../context/geoJSONContext';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { uid } from 'uid';
import buffer from '@turf/buffer';



function Buffer(props: { handleCloseModal: () => void;}) {
  const [geoJSONs, setGeoJSONs] = useState<FeatureCollection[]>([])
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
    //console.log("List after ok press:", files)
    console.log("List of Local GeoJSONS after ok", geoJSONs)
    console.log("List of Global GeoJSONS after ok", geoJSONList)
    
  }
  const handleChoseLayer = (event: ChangeEvent<HTMLInputElement>) => {
    const chosenLayer: GeoJSONItem | undefined = geoJSONList.find((layer) => layer.id === event.target.value);
    setSelectedLayer(chosenLayer);
  }

  return (
    <div style={{display: "flex", flexDirection: "column",  justifyContent: "center", alignItems: "center" }}>
        <Typography variant="h6"> Buffer Tool:</Typography>
        <div style={{width: '100%', justifyContent: 'center', display: 'flex' }}>
        <TextField
          id="Selected-buffer-layer"
          select
          label="Select layer"
          onChange={handleChoseLayer}
        >
          {geoJSONList.map((layer) => (
            <MenuItem key={layer.id} value={layer.id} >
              {layer.name}
            </MenuItem>
          ))}
        </TextField>
        </div>
        <TextField
          error
          id="outlined-error"
          label="Buffer radius in m"
          onChange={(e) => handleBufferSelect(e)}
        
        />
        <TextField
          required
          id="outlined-required"
          label="Name of output layer"
          onChange={(e) => setName(e.target.value)}
        />
      <div style={{flexDirection: 'row', justifyContent: 'space-between', display: 'flex'}}>
      <Button variant="outlined" color="error" onClick={props.handleCloseModal}>Cancel</Button>
      <Button onClick={handleOk} variant="outlined">OK</Button>
      </div>
    </div>
    
  );
}
export default Buffer;