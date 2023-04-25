import React, { useState, ChangeEvent, useEffect } from 'react';
import Button from '@mui/material/Button';
import {
  AlertColor,
  Box,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { FeatureCollection } from 'geojson';
import { useGeoJSONContext, GeoJSONItem } from '../context/geoJSONContext';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { modalStyle } from './styledComponents';
import Loading from './loading';
import { generateColor } from '../utils/genereateColor';
import generateId from '../utils/generateId';

function FeatureExtractor(props: {
  handleCloseModal: () => void;
  showAlert: (status: AlertColor, message: string) => void;
}) {
  const [selectedLayer, setSelectedLayer] = useState<GeoJSONItem>();
  const [selectedValue, setSelectedValue] = useState<string | number>('');
  const [operation, setOperation] = useState<string>();
  const { geoJSONList, setGeoJSONList } = useGeoJSONContext();
  const [uniqueProperties, setUniqueProperties] = useState<string[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const operations: string[] = ['=', '≠', '<', '>'];

  useEffect(() => {
    // create a Set to store the unique properties
    const uniqueProperties = new Set<string>();

    // loop through each feature in the GeoJSON
    selectedLayer?.geoJSON.features.forEach((feature) => {
      // loop through each property in the feature
      for (const key in feature.properties) {
        // check if the property is not a function and is not already in the Set
        if (
          Object.prototype.hasOwnProperty.call(feature.properties, key) &&
          !uniqueProperties.has(key)
        ) {
          // if it's not, add it to the Set
          uniqueProperties.add(key);
        }
      }
    });

    // convert the Set to an array and update the state
    setUniqueProperties(Array.from(uniqueProperties));
  }, [selectedLayer]);

  const handleChoseProperty = (event: SelectChangeEvent) => {
    setSelectedProperty(event.target.value);
  };

  const handleChoseOperation = (event: SelectChangeEvent) => {
    setOperation(event.target.value);
  };

  const handleExtract = () => {
    console.log('selectedLayer:', selectedLayer);
    const extracted: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };
    let target: number | string = selectedValue;

    //If input is a number, convert to number for easier comparison
    if (!isNaN(+target)) {
      target = Number(target);
    }
    switch (operation) {
      case '=':
        console.log('case: equal');
        if (
          selectedLayer &&
          selectedLayer.geoJSON.features &&
          selectedLayer.geoJSON.features.length > 0
        ) {
          const matchingFeatures = selectedLayer.geoJSON.features.filter((feature) => {
            // loop through each property in the feature
            for (const key in feature.properties) {
              if (
                Object.prototype.hasOwnProperty.call(feature.properties, key) &&
                feature.properties[key] === target
              ) {
                // if it matches, return true to include the feature in the filtered array
                return true;
              }
            }
            // if none of the properties match, return false to exclude the feature from the filtered array
            return false;
          });
          extracted.features = matchingFeatures;
        }
        break;

      case '≠':
        console.log('Case: not equals');
        if (
          selectedLayer &&
          selectedLayer.geoJSON.features &&
          selectedLayer.geoJSON.features.length > 0
        ) {
          const matchingFeatures = selectedLayer.geoJSON.features.filter((feature) => {
            // loop through each property in the feature
            for (const key in feature.properties) {
              if (
                Object.prototype.hasOwnProperty.call(feature.properties, key) &&
                feature.properties[key] === target
              ) {
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
      case '>':
        console.log('Case: greater');
        if (
          selectedLayer &&
          selectedLayer.geoJSON.features &&
          selectedLayer.geoJSON.features.length > 0
        ) {
          const matchingFeatures = selectedLayer.geoJSON.features.filter((feature) => {
            // loop through each property in the feature
            for (const key in feature.properties) {
              if (Object.prototype.hasOwnProperty.call(feature.properties, key)) {
                const propValue = feature.properties[key];
                if (
                  typeof propValue === 'number' &&
                  propValue > Number(target) &&
                  feature.properties[key] != null
                ) {
                  // if the property is a number and is greater than the selected value,
                  // return true to include the feature in the filtered array
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
      case '<':
        console.log('Case: less');
        if (
          selectedLayer &&
          selectedLayer.geoJSON.features &&
          selectedLayer.geoJSON.features.length > 0
        ) {
          const matchingFeatures = selectedLayer.geoJSON.features.filter((feature) => {
            // loop through each property in the feature
            for (const key in feature.properties) {
              console.log('featureProp', feature.properties[key], 'and target:', target);
              if (
                Object.prototype.hasOwnProperty.call(feature.properties, key) &&
                feature.properties[key] != null &&
                feature.properties[key] < target
              ) {
                // if it is, return true to include the feature in the filtered array
                return true;
              }
            }
            // if none of the properties match, return false to exclude the feature from the filtered array
            return false;
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
    setIsLoading(true);
    setTimeout(() => {
      const extract = handleExtract();
      if (extract.features.length === 0) {
        props.showAlert('warning', 'no features matching you query');
        setIsLoading(false);
      } else {
        const newObj: GeoJSONItem = {
          id: generateId(),
          name: selectedLayer?.name + '_ext',
          visible: true,
          color: generateColor(),
          opacity: 0.5,
          geoJSON: extract as FeatureCollection,
        };

        setGeoJSONList((prevGeoJSONs: GeoJSONItem[]) => [...prevGeoJSONs, newObj as GeoJSONItem]);
        setIsLoading(false);
        props.handleCloseModal();
      }
    }, 10);
  };

  const handleChoseLayer = (event: ChangeEvent<HTMLInputElement>) => {
    const chosenLayer: GeoJSONItem = geoJSONList.find(
      (layer) => layer.id === event.target.value
    ) as GeoJSONItem;
    setSelectedLayer(chosenLayer);
  };

  return (
    <>
      {isLoading ? (
        <Box sx={{ modalStyle, height: '100px' }}>
          <Loading />
        </Box>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flexWrap: 'wrap',
            width: '100%',
          }}
        >
          <Typography variant="h6"> Feature extractor:</Typography>
          <TextField
            style={{ paddingTop: '10px' }}
            id="Selected-buffer-layer"
            select
            label="Select layer:"
            onChange={handleChoseLayer}
            variant="filled"
            defaultValue={''}
          >
            {geoJSONList.map((layer) => (
              <MenuItem key={layer.id} value={layer.id}>
                {layer.name}
              </MenuItem>
            ))}
          </TextField>
          <div style={{ flexDirection: 'row', display: 'flex', justifyContent: 'space-between' }}>
            <FormControl sx={{ m: 1, width: 150 }}>
              <Typography variant="subtitle1" fontSize={1}>
                <InputLabel sx={{ fontSize: 12 }} id="demo-multiple-chip-label">
                  Select Property
                </InputLabel>
              </Typography>
              <Select
                variant="filled"
                value={selectedProperty}
                onChange={handleChoseProperty}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
                defaultValue=""
              >
                <MenuItem value=""></MenuItem>
                {uniqueProperties.map((prop) => (
                  <MenuItem key={prop} value={prop}>
                    {prop}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 80 }}>
              <InputLabel id="demo-multiple-chip-label">Operation</InputLabel>
              <Select
                variant="filled"
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                //value={operation}
                label="Operation"
                onChange={handleChoseOperation}
                defaultValue=""
              >
                {operations.map((operation) => (
                  <MenuItem key={operation} value={operation}>
                    {operation}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, width: 150 }}>
              <TextField
                variant="filled"
                label="Value"
                onChange={(e) => setSelectedValue(e.target.value)}
                defaultValue=""
              ></TextField>
            </FormControl>
          </div>
          <div
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              display: 'flex',
              paddingTop: '10px',
            }}
          >
            <Button variant="outlined" color="error" onClick={props.handleCloseModal}>
              Cancel
            </Button>
            <Button variant="outlined" onClick={handleOk}>
              OK
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
export default FeatureExtractor;
