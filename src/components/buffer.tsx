import React, { useState, ChangeEvent, } from 'react';
import Button from '@mui/material/Button';
import { AlertColor, Box, Typography } from '@mui/material';
import { FeatureCollection, Polygon } from 'geojson';
import { useGeoJSONContext, GeoJSONItem} from '../context/geoJSONContext';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { uid } from 'uid';
import buffer from '@turf/buffer';
import flatten from '@turf/flatten';
import dissolve from '@turf/dissolve';
import { Properties } from '@turf/helpers';
import Loading from './loading';
import { modalStyle } from './styledComponents';

function Buffer(props: { handleCloseModal: () => void; showAlert: (status: AlertColor, message: string) => void}) {
  const [selectedLayer, setSelectedLayer] = useState<GeoJSONItem>()
  const [name, setName] = useState<string>("buffered")
  const [bufferRadius, setBufferRadius] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)

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
     //Flatten if there are MultiPolygons(to make dissolve work)
     let isPoly = false;
     selectedLayer?.geoJSON.features.forEach(feature => {
      if(feature.geometry.type === 'MultiPolygon'){
        isPoly = true;
        flatten(feature.geometry)
      }
    })
    if(isPoly){
      dissolve(selectedLayer?.geoJSON as FeatureCollection<Polygon, Properties>)
    }
    const buffered = buffer(selectedLayer?.geoJSON as FeatureCollection, bufferRadius, {units: 'meters'})
    return buffered;
  }

  const handleOk = () => {
    setIsLoading(true);
    setTimeout(() => {
      let buffered = handleBuffer();
      const newObj: GeoJSONItem = {
        id: uid(),
        name: name,
        visible: true,
        color: getRandomColor(),
        opacity: 0.5,
        geoJSON: buffered as FeatureCollection,
      };
      setGeoJSONList((prevGeoJSONs: GeoJSONItem[]) => [...prevGeoJSONs,newObj as GeoJSONItem]);
      setIsLoading(false);
      props.handleCloseModal();
      props.showAlert("success","");
    }, 10);
  };
  const handleChoseLayer = (event: ChangeEvent<HTMLInputElement>) => {
    const chosenLayer: GeoJSONItem | undefined = geoJSONList.find((layer) => layer.id === event.target.value);
    if (chosenLayer) {
      setSelectedLayer(chosenLayer);
    } else {
      setSelectedLayer(undefined);
    }
  }
  

  return (
    <>
    {isLoading ? ( // Check if isLoading is true
        // If it is, render the loading component
        <Box sx={{modalStyle, height: '100px'}}>
       <Loading/>
       </Box>
      ) : (
    <div style={{display: "flex", flexDirection: "column",  justifyContent: "center", flexWrap: 'wrap', width: '100%'}}>
        <Typography variant="h6"> Buffer Tool:</Typography>
      
        <TextField
        style={{paddingTop: '10px'}}
        id="Selected-buffer-layer"
        select
        label="Select layer"
        onChange={handleChoseLayer}
        variant="filled"
        defaultValue={""}
      >
        
        {geoJSONList.map((layer) => (
          <MenuItem key={layer.id} value={layer.id}>
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
          defaultValue={""}
        
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
      <Button onClick={handleOk} variant="outlined" sx={{color: "#2975a0e6", borderColor: "#2975a0e6"}}>OK</Button>
      </div>
    </div>)}
    </>
  );
}
export default Buffer;