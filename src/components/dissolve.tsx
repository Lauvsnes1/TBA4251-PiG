import React, { useState, ChangeEvent, useEffect } from 'react';
import Button from '@mui/material/Button';
import {
  AlertColor,
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  Select,
  Typography,
} from '@mui/material';
import { FeatureCollection, Polygon } from 'geojson';
import { useGeoJSONContext, GeoJSONItem } from '../context/geoJSONContext';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Loading from './loading';
import { modalStyle } from './styledComponents';
import { generateColor } from '../utils/genereateColor';
import generateId from '../utils/generateId';
import createUniqueName from '../utils/createUniqueName';
import flatten from '@turf/flatten';
import dissolve from '@turf/dissolve';
import { Properties } from '@turf/helpers';

function Dissolve(props: {
  handleCloseModal: () => void;
  showAlert: (status: AlertColor, message: string) => void;
}) {
  const [selectedLayer, setSelectedLayer] = useState<GeoJSONItem>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [uniqueProperties, setUniqueProperties] = useState<string[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const { geoJSONList, setGeoJSONList } = useGeoJSONContext();

  const handleChoseLayer = (event: ChangeEvent<HTMLInputElement>) => {
    let isPoly = true;
    const chosenLayer: GeoJSONItem = geoJSONList.find(
      (layer) => layer.id === event.target.value
    ) as GeoJSONItem;
    chosenLayer.geoJSON.features.forEach((feature) => {
      if (feature.geometry.type !== 'Polygon' && feature.geometry.type !== 'MultiPolygon') {
        isPoly = false;
      }
    });
    if (isPoly) {
      setSelectedLayer(chosenLayer);
    } else {
      props.showAlert('warning', 'Please select a polygon layer');
    }
  };

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

  function handleDissolve(): { processed: FeatureCollection<Polygon, Properties> } {
    const flattened: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    selectedLayer?.geoJSON.features.forEach((feature) => {
      if (feature.geometry.type === 'MultiPolygon') {
        const tempGeom = flatten(feature.geometry);
        tempGeom.features.forEach((poly) => {
          flattened.features.push(poly);
        });
      } else {
        flattened.features.push(feature);
      }
    });
    if (isChecked && selectedProperty) {
      const processed = dissolve(flattened as FeatureCollection<Polygon, Properties>, {
        propertyName: selectedProperty,
      });
      return { processed };
    } else {
      const processed = dissolve(flattened as FeatureCollection<Polygon, Properties>);
      return { processed };
    }
  }

  const handleOk = () => {
    setIsLoading(true);
    setTimeout(() => {
      try {
        const dissolved = handleDissolve();
        if (dissolved.processed.features.length > 0) {
          const newObj: GeoJSONItem = {
            id: generateId(),
            name: createUniqueName(name, geoJSONList),
            visible: true,
            color: generateColor(),
            opacity: 0.5,
            geoJSON: dissolved.processed as FeatureCollection,
          };
          setGeoJSONList((prevGeoJSONs: GeoJSONItem[]) => [...prevGeoJSONs, newObj as GeoJSONItem]);
          setIsLoading(false);
          //pass state up to close modal
          props.handleCloseModal();
          props.showAlert('success', '');
        } else {
          setIsLoading(false);
          props.showAlert('warning', 'No Intersect');
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        props.showAlert('error', 'Invalid Input');
      }
    }, 10);
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
          <Typography variant="h6"> Dissolve Tool:</Typography>
          <TextField
            style={{ paddingTop: '10px' }}
            id="Selected-buffer-layer"
            select
            label="Select layer one"
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

          <FormControl
            sx={{
              mt: 1,
              width: 'auto',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <FormControlLabel
              value="female"
              control={<Radio checked={isChecked} onClick={() => setIsChecked(!isChecked)} />}
              label="dissolve on property"
            />
            <Box sx={{ flexDirection: 'column' }}>
              <Select
                sx={{ width: '200px' }}
                disabled={!isChecked}
                variant="filled"
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                displayEmpty
                inputProps={{ 'aria-label': 'Select property' }}
                defaultValue=""
              >
                <MenuItem value=""></MenuItem>
                {uniqueProperties.map((prop) => (
                  <MenuItem key={prop} value={prop}>
                    {prop}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </FormControl>
          <TextField
            required
            id="outlined-required"
            label="Name of output layer"
            onChange={(e) => setName(e.target.value)}
            style={{ paddingTop: '10px' }}
            variant="filled"
          />
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
            <Button onClick={handleOk} variant="outlined">
              OK
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
export default Dissolve;
