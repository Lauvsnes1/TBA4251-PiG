import React, { useState, ChangeEvent } from 'react';
import Button from '@mui/material/Button';
import { AlertColor, Box, Typography } from '@mui/material';
import { FeatureCollection, GeoJsonProperties, Geometry, Point } from 'geojson';
import { useGeoJSONContext, GeoJSONItem } from '../context/geoJSONContext';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import voronoi from '@turf/voronoi';
import bbox from '@turf/bbox';

import Loading from './loading';
import { modalStyle } from './styledComponents';
import { BBox } from '@turf/helpers';
import { generateColor } from '../utils/genereateColor';
import generateId from '../utils/generateId';

function Voronoi(props: {
  handleCloseModal: () => void;
  showAlert: (status: AlertColor, message: string) => void;
}) {
  const [selectedLayer, setSelectedLayer] = useState<GeoJSONItem>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>('voronoi');

  const { geoJSONList, setGeoJSONList } = useGeoJSONContext();

  function handleVoronoi() {
    const finalVoronoi: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    if (selectedLayer?.geoJSON) {
      const layer = selectedLayer?.geoJSON as FeatureCollection<Point>;
      //Calculate bounding box
      const boundingBox = bbox(layer);
      var options = {
        bbox: boundingBox as BBox,
      };

      //Calculate voronoi with bounding box
      const res = voronoi(layer, options);

      //Check that there are no null features
      res.features.forEach((feature) => {
        if (feature.geometry) {
          finalVoronoi.features.push(feature);
        }
      });
    }
    return finalVoronoi;
  }

  const handleOk = () => {
    setIsLoading(true);
    setTimeout(() => {
      const voronoiPolygon = handleVoronoi();
      if (voronoiPolygon.features.length > 0) {
        const newObj: GeoJSONItem = {
          id: generateId(),
          name: createUniqueName(name),
          visible: true,
          color: generateColor(),
          opacity: 0.5,
          geoJSON: voronoiPolygon as FeatureCollection<Geometry, GeoJsonProperties>,
        };
        setGeoJSONList((prevGeoJSONs: GeoJSONItem[]) => [...prevGeoJSONs, newObj as GeoJSONItem]);
        setIsLoading(false);
        //pass state up to close modal
        props.handleCloseModal();
        props.showAlert('success', '');
      } else {
        setIsLoading(false);
        props.showAlert('error', 'Please select a valid layer');
      }
    }, 10);
  };

  const handleChoseLayer = (event: ChangeEvent<HTMLInputElement>) => {
    let isPoint = true;
    const chosenLayer: GeoJSONItem = geoJSONList.find(
      (layer) => layer.id === event.target.value
    ) as GeoJSONItem;
    chosenLayer.geoJSON.features.forEach((element) => {
      if (element.geometry.type !== 'Point') {
        isPoint = false;
      }
    });
    if (isPoint) {
      setSelectedLayer(chosenLayer);
    } else {
      props.showAlert('warning', 'Selected layer is not a Point layer');
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
          <Typography variant="h6">Voronoi Tool:</Typography>

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
          <TextField
            required
            id="outlined-required"
            label="Name of output layer"
            onChange={(e) => setName(e.target.value)}
            style={{ paddingTop: '10px' }}
            variant="filled"
            defaultValue={name}
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
export default Voronoi;
