import React, { useState, ChangeEvent } from 'react';
import Button from '@mui/material/Button';
import { AlertColor, Box, Typography } from '@mui/material';
import { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import { useGeoJSONContext, GeoJSONItem } from '../context/geoJSONContext';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { uid } from 'uid';
import intersect from '@turf/intersect';
import booleanOverlap from '@turf/boolean-overlap';
import Loading from './loading';
import { modalStyle } from './styledComponents';
import { flattenFeatures } from '../utils/flattenAndDissolve';

function Intersect(props: {
  handleCloseModal: () => void;
  showAlert: (status: AlertColor, message: string) => void;
}) {
  const [selectedLayer1, setSelectedLayer1] = useState<GeoJSONItem>();
  const [selectedLayer2, setSelectedLayer2] = useState<GeoJSONItem>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

  function handleIntersection() {
    const intersections: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    if (selectedLayer1?.geoJSON && selectedLayer2?.geoJSON) {
      const layer1 = selectedLayer1?.geoJSON;
      const layer2 = selectedLayer2?.geoJSON;

      const { processed1, processed2 } = flattenFeatures(layer1, layer2);

      processed1.features.forEach((feature1) => {
        processed2.features.forEach((feature2) => {
          if (booleanOverlap(feature1, feature2)) {
            if (feature1.geometry.type === 'Polygon' && feature2.geometry.type === 'Polygon') {
              const intersection = intersect(feature1.geometry, feature2.geometry);
              if (
                intersection !== null &&
                intersections.features.every((feat) => !booleanOverlap(intersection, feat))
              ) {
                const intersectionFeature: Feature<Polygon | MultiPolygon> = {
                  type: 'Feature',
                  properties: { ...feature1.properties, ...feature2.properties }, // combine properties from both input features
                  geometry: intersection.geometry,
                };
                intersections.features.push(intersectionFeature);
              }
            }
          }
        });
      });
    }
    return intersections;
  }

  const handleOk = () => {
    setIsLoading(true);
    setTimeout(() => {
      const intersected = handleIntersection();
      const newObj: GeoJSONItem = {
        id: uid(),
        name: name,
        visible: true,
        color: getRandomColor(),
        opacity: 0.5,
        geoJSON: intersected as FeatureCollection,
      };
      setGeoJSONList((prevGeoJSONs: GeoJSONItem[]) => [...prevGeoJSONs, newObj as GeoJSONItem]);
      setIsLoading(false);
      //pass state up to close modal
      props.handleCloseModal();
      props.showAlert('success', '');
    }, 10);
  };

  const handleChoseLayer1 = (event: ChangeEvent<HTMLInputElement>) => {
    const chosenLayer: GeoJSONItem = geoJSONList.find(
      (layer) => layer.id === event.target.value
    ) as GeoJSONItem;
    setSelectedLayer1(chosenLayer);
  };

  const handleChoseLayer2 = (event: ChangeEvent<HTMLInputElement>) => {
    const chosenLayer: GeoJSONItem = geoJSONList.find(
      (layer) => layer.id === event.target.value
    ) as GeoJSONItem;
    setSelectedLayer2(chosenLayer);
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
          <Typography variant="h6"> Intersect Tool:</Typography>

          <TextField
            style={{ paddingTop: '10px' }}
            id="Selected-buffer-layer"
            select
            label="Select layer one"
            onChange={handleChoseLayer1}
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
            style={{ paddingTop: '10px' }}
            id="Selected-buffer-layer"
            select
            label="Select layer two"
            onChange={handleChoseLayer2}
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
export default Intersect;
