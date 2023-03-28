import React, { useState, ChangeEvent, useEffect } from 'react';
import Button from '@mui/material/Button';
import { FormControl, FormHelperText, InputLabel, Select, SelectChangeEvent, Typography } from '@mui/material';
import { Feature, FeatureCollection, GeoJsonProperties, Geometry, MultiPolygon, Polygon } from 'geojson';
import { useGeoJSONContext, GeoJSONItem } from '../context/geoJSONContext';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { uid } from 'uid';
import differnce from '@turf/difference';

function FeatureExtractor(props: { handleCloseModal: () => void; }) {
  const [selectedLayer, setSelectedLayer] = useState<GeoJSONItem>();
  const [selectedValue, setSelectedValue] = useState<string | number>('');
  const [operation, setOperation] = useState<string>();
  const { geoJSONList, setGeoJSONList } = useGeoJSONContext();
  const [uniqueProperties, setUniqueProperties] = useState<string[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string>("")

  const operations: string[] = ["equals", "not equals", "greater", "less", "greater and eual", "less and equal"]

  useEffect(() => {
    //Kanskje flytte inn i onSelectlayer funksjonen
    console.log("kjører useEffect med:", selectedLayer);
    // create a Set to store the unique properties
    const uniqueProperties = new Set<string>();
  
    // loop through each feature in the GeoJSON
    selectedLayer?.geoJSON.features.forEach((feature) => {
      // loop through each property in the feature
      for (const key in feature.properties) {
        // check if the property is not a function and is not already in the Set
        if (Object.prototype.hasOwnProperty.call(feature.properties, key) && !uniqueProperties.has(key)) {
          // if it's not, add it to the Set
          uniqueProperties.add(key);
        }
      }
    });
  
    // convert the Set to an array and update the state
    setUniqueProperties(Array.from(uniqueProperties));
  }, [selectedLayer]);
  


  function getRandomColor(): string {
    const hexChars = '0123456789ABCDEF';
    let hexColor = '#';

    // generate a random hex color code
    for (let i = 0; i < 6; i++) {
      hexColor += hexChars[Math.floor(Math.random() * 16)];
    }

    return hexColor;
  }

  const handleChoseProperty = (event: SelectChangeEvent) => {
    setSelectedProperty(event.target.value)
  }

  const handleExtract = () => {
    const test2: string[] = [];
    const extracted: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };
    console.log('Extraherer med variabler:')
    console.log("selected layer:", selectedLayer)
    console.log('Operation:', operation);
    console.log("Value:", selectedValue)
    console.log("selectedProperty", selectedProperty)
    let target: number | string = selectedValue;

    //If input is a number, convert for easier comparison
    if(!isNaN(+target)){
        target = Number(target)       
    }
    switch(operation) {

        case 'equals':
            console.log('case: equal')
            if (selectedLayer && selectedLayer.geoJSON.features && selectedLayer.geoJSON.features.length > 0) {
            const matchingFeatures = selectedLayer.geoJSON.features.filter((feature) => {
                // loop through each property in the feature
                for (const key in feature.properties) {
                if (Object.prototype.hasOwnProperty.call(feature.properties, key) && feature.properties[key] === target) {
                    // if it does, return true to include the feature in the filtered array
                    return true;
                }
                }
                // if none of the properties match, return false to exclude the feature from the filtered array
                return false;
            });
            extracted.features = matchingFeatures;
            }
            break;

        case 'not equals':
            console.log("Case: not equals")
            if (selectedLayer && selectedLayer.geoJSON.features && selectedLayer.geoJSON.features.length > 0) {
                const matchingFeatures = selectedLayer.geoJSON.features.filter((feature) => {
                    // loop through each property in the feature
                    for (const key in feature.properties) {
                    if (Object.prototype.hasOwnProperty.call(feature.properties, key) && feature.properties[key] === target) {
                        // if it does, return true to include the feature in the filtered array
                        return false;
                    }
                    }
                    // if none of the properties match, return false to exclude the feature from the filtered array
                    return true;
                });
                extracted.features = matchingFeatures;
                }
            break;
        case 'greater':
            console.log("Case: greater")
            if (selectedLayer && selectedLayer.geoJSON.features && selectedLayer.geoJSON.features.length > 0) {
                const matchingFeatures = selectedLayer.geoJSON.features.filter((feature) => {
                  // loop through each property in the feature
                  for (const key in feature.properties) {
                    if (Object.prototype.hasOwnProperty.call(feature.properties, key)) {
                      const propValue = feature.properties[key];
                      if (typeof propValue === 'number' && propValue > target) {
                        // if the property is a number and is greater than the selected value, return true to include the feature in the filtered array
                        return true;
                      }
                    }
                  }
                  // if none of the properties match, return false to exclude the feature from the filtered array
                  return false;
                });
                extracted.features = matchingFeatures;
              }
            break;
        case 'less':
            console.log("Case: less")
            if (selectedLayer && selectedLayer.geoJSON.features && selectedLayer.geoJSON.features.length > 0) {
                const matchingFeatures = selectedLayer.geoJSON.features.filter((feature) => {
                  // loop through each property in the feature
                  for (const key in feature.properties) {
                    if (Object.prototype.hasOwnProperty.call(feature.properties, key)) {
                      const propValue = feature.properties[key];
                      if (typeof propValue === 'number' && propValue > selectedValue) {
                        // if the property is a number and is greater than the selected value, return true to include the feature in the filtered array
                        return false;
                      }
                    }
                  }
                  // if none of the properties match, return false to exclude the feature from the filtered array
                  return true;
                });
                extracted.features = matchingFeatures;
              }
            break;
  
      default:
        break;
    }
  
    // update state with the extracted features
    return extracted;
  };
  



  const handleOk = () => {
    const extract = handleExtract();
    const newObj: GeoJSONItem = {
      id: uid(),
      name: selectedLayer?.name + "_ext",
      visible: true,
      color: getRandomColor(),
      opacity: 0.5,
      geoJSON: extract as FeatureCollection,
    };
    setGeoJSONList((prevGeoJSONs: GeoJSONItem[]) => [...prevGeoJSONs, newObj as GeoJSONItem]);
    props.handleCloseModal();
  };

  const handleChoseLayer = (event: ChangeEvent<HTMLInputElement>) => {
    const chosenLayer: GeoJSONItem = geoJSONList.find((layer) => layer.id === event.target.value) as GeoJSONItem;
    setSelectedLayer(chosenLayer);
  };


  return (
    <div style={{display: "flex", flexDirection: "column",  justifyContent: "center", flexWrap: 'wrap', width: '100%' }}>
        <Typography variant="h6"> Feature extractor:</Typography>
      
        <TextField
          style={{paddingTop: '10px'}}
          id="Selected-buffer-layer"
          select
          label="Select layer:"
          onChange={handleChoseLayer}
          variant="filled"
          defaultValue={""}
        >
          {geoJSONList.map((layer) => (
            <MenuItem key={layer.id} value={layer.id} >
              {layer.name}
            </MenuItem>
          ))}
        </TextField>
        <div style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
        <Select
          value={selectedProperty}
          onChange={handleChoseProperty}
          label={"Operation"}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
          defaultValue=""
        >
          <MenuItem value="">
          </MenuItem>
          {uniqueProperties.map((prop) => (
         <MenuItem key={prop} value={prop} >
              {prop}
        </MenuItem>
          ))}
          
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-helper-label">Operation</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          //value={age}
          label="Operation"
          onChange={(e) => setOperation(e.target.value)}
          defaultValue=""
        >
        {operations.map((operation) => (
         <MenuItem key={operation} value={operation} >
              {operation}
        </MenuItem>
          ))}

        </Select>
      </FormControl>
      <TextField 
      variant="filled" 
      onChange={(e) => setSelectedValue(e.target.value)}
      defaultValue=""
      >
      </TextField>

      
    </div>
      <div style={{flexDirection: 'row', justifyContent: 'space-around', display: 'flex', paddingTop: '10px'}}>
      <Button variant="outlined" color="error" onClick={props.handleCloseModal}>Cancel</Button>
      <Button variant="outlined" onClick={handleOk}>OK</Button>
      </div>
    </div>
    
  );
}
export default FeatureExtractor;