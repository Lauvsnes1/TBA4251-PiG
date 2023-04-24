import React, { useState, ChangeEvent } from 'react';
import Button from '@mui/material/Button';
import { AlertColor, Box, Typography } from '@mui/material';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { useGeoJSONContext, GeoJSONItem } from '../context/geoJSONContext';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import buffer from '@turf/buffer';
import Loading from './loading';
import { modalStyle } from './styledComponents';
import { generateColor } from '../utils/genereateColor';
import processData from '../utils/flattenAndDissolve';
import generateId from '../utils/generateId';

function Buffer(props: {
  handleCloseModal: () => void;
  showAlert: (status: AlertColor, message: string) => void;
}) {
  const [selectedLayer, setSelectedLayer] = useState<GeoJSONItem>();
  const [name, setName] = useState<string>('buffered');
  const [bufferRadius, setBufferRadius] = useState<number>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { geoJSONList, setGeoJSONList } = useGeoJSONContext();

  const handleBufferSelect = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBufferRadius(Number(e.target.value));
  };

  const handleBuffer = () => {
    let isMultiPoly = false;
    const layer = selectedLayer?.geoJSON as FeatureCollection<Geometry, GeoJsonProperties>;
    //Check each feature in layer if its MultiPolygon
    layer.features.forEach((feature) => {
      if (feature.geometry.type === 'MultiPolygon') {
        isMultiPoly = true;
      }
    });
    if (isMultiPoly) {
      //if its a multiPolygon, flatten and dissolve
      const processed = processData(layer);
      const buffered = buffer(processed.processed1 as FeatureCollection, bufferRadius, {
        units: 'meters',
      });
      return buffered;
    } else {
      const buffered = buffer(layer as FeatureCollection, bufferRadius, {
        units: 'meters',
      });
      return buffered;
    }
  };

  const handleOk = () => {
    setIsLoading(true);
    // we delay the operation with 10ms to make the loading work
    setTimeout(() => {
      try {
        let buffered = handleBuffer();
        const newObj: GeoJSONItem = {
          id: generateId(),
          name: createUniqueName(name),
          visible: true,
          color: generateColor(),
          opacity: 0.5,
          geoJSON: buffered as FeatureCollection,
        };
        //update global list with the new object
        setGeoJSONList((prevGeoJSONs: GeoJSONItem[]) => [...prevGeoJSONs, newObj as GeoJSONItem]);
        setIsLoading(false);
        props.handleCloseModal();
        props.showAlert('success', '');
      } catch {
        setIsLoading(false);
        props.showAlert('error', 'Invalid input');
      }
    }, 10);
  };
  const handleChoseLayer = (event: ChangeEvent<HTMLInputElement>) => {
    const chosenLayer: GeoJSONItem | undefined = geoJSONList.find(
      (layer) => layer.id === event.target.value
    );
    if (chosenLayer) {
      setSelectedLayer(chosenLayer);
    } else {
      setSelectedLayer(undefined);
    }
  };

  function createUniqueName(name: string) {
    let count = 0;
    const baseName = name;
    const names = geoJSONList.map((item) => item.name);

    while (names.includes(name)) {
      count++;
      name = `${baseName}_${count}`;
    }
    return name;
  }

  return (
    <>
      {isLoading ? ( // Check if isLoading is true
        // If it is, render the loading component
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
          <Typography variant="h6"> Buffer Tool:</Typography>

          <TextField
            style={{ paddingTop: '10px' }}
            id="Selected-buffer-layer"
            select
            label="Select layer"
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
          <TextField
            id="outlined-error"
            label="Buffer radius in [m]"
            onChange={(e) => handleBufferSelect(e)}
            style={{ paddingTop: '10px' }}
            variant="filled"
            type="number"
            defaultValue={''}
          />
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
            <Button
              onClick={handleOk}
              variant="outlined"
              sx={{ color: '#2975a0', borderColor: '#2975a0' }}
            >
              OK
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
export default Buffer;
