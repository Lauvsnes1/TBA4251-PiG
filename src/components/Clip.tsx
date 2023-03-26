/* eslint-disable react/prop-types */
import React, { useState, ChangeEvent } from 'react';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import { Feature, FeatureCollection, LineString, MultiPolygon, Polygon } from 'geojson';
import { useGeoJSONContext, GeoJSONItem } from '../context/geoJSONContext';
import TextField from '@mui/material/TextField';
import { uid } from 'uid';
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import intersect from '@turf/intersect';
import { polygonToLine } from '@turf/polygon-to-line';
import lineSplit from '@turf/line-split';
import booleanCrosses from '@turf/boolean-crosses';
import booleanContains from '@turf/boolean-contains';
import booleanDisjoint from '@turf/boolean-disjoint';
import buffer from '@turf/buffer';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, personName: readonly string[], theme: Theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

function Clip(props: { handleCloseModal: () => void; }) {
  const [selectedMainLayer, setSelectedMainLayer] = useState<GeoJSONItem>();
  const [layerNames, setLayerNames] = useState<string[]>([]);
  const [isLoading, setIsLoading ] = useState<boolean>(false)
  const theme = useTheme();

  const { geoJSONList, setGeoJSONList } = useGeoJSONContext();

  const handleChange = (event: SelectChangeEvent<typeof layerNames>) => {
    const {
      target: { value },
    } = event;
    setLayerNames(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
    console.log("layers selected:", layerNames)
  };

  function getRandomColor(): string {
    const hexChars = '0123456789ABCDEF';
    let hexColor = '#';

    // generate a random hex color code
    for (let i = 0; i < 6; i++) {
      hexColor += hexChars[Math.floor(Math.random() * 16)];
    }

    return hexColor;
  }
  const findAllLayers = () => {
    const selectedPolygonLayers: GeoJSONItem[] = [];
    const selectedLineStringLayers: GeoJSONItem[] = [];

    layerNames.forEach((item) => {
      const matchingLayer = geoJSONList.find(layer => layer.name === item);
      if (matchingLayer && matchingLayer.geoJSON.features[0].geometry.type ==="Polygon") {
        selectedPolygonLayers.push(matchingLayer);
      }
      if(matchingLayer && matchingLayer.geoJSON.features[0].geometry.type ==="LineString"){
        selectedLineStringLayers.push(matchingLayer)
      }
    });
    return [selectedPolygonLayers, selectedLineStringLayers];
  };
  
  function handleClip() {
    const totalClippedList = new Map<string, FeatureCollection>(); 
    //Find all selectedlayers
    const [selectedPolyLayers, selectedLineLayers]  = findAllLayers();
    console.log("SelectedLayers", selectedPolyLayers)
    console.log("SelectedLineLayers", selectedLineLayers)
selectedPolyLayers.forEach((polyLayer) => {
  const clipps: FeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  };
  if (selectedMainLayer?.geoJSON && polyLayer?.geoJSON) {
    selectedMainLayer.geoJSON.features.forEach((mainFeature) => {
      if (mainFeature.geometry.type === "Polygon") {
        polyLayer.geoJSON.features.forEach((polyFeature) => {
          if (polyFeature.geometry.type === "Polygon") {
            const clipped = intersect(mainFeature.geometry as Polygon, polyFeature.geometry as Polygon) as Feature<Polygon | MultiPolygon>;
            if (clipped !== null) {
              clipps.features.push(clipped);
            }
          }
        });
      }
    });
  }
  totalClippedList.set(polyLayer.name, clipps);
});

for (const selectedLineLayer of selectedLineLayers) {
  const clipps: FeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  };
  if (selectedMainLayer?.geoJSON && selectedLineLayer.geoJSON) {
    selectedMainLayer.geoJSON.features.forEach((mainFeature) => {
      if (mainFeature.geometry.type === 'Polygon') {
        selectedLineLayer.geoJSON.features.forEach((lineFeature) => {
          if (lineFeature.geometry.type === 'LineString') {
            const line = lineFeature as Feature<LineString>;
            const polygon = mainFeature.geometry as Polygon;

            if (booleanDisjoint(line, mainFeature)) {
              // Line is completely outside
              //console.log('Line is completely outside');
            } else if (booleanContains(polygon, line) && !booleanCrosses(polygon, line)) {
              // Line is completely inside
              //console.log('Line is completely inside');
              clipps.features.push(line);
            } else {
              // Line intersects with polygon
              const polyLine = polygonToLine(polygon);
              const clippedLines = lineSplit(line, polyLine) as FeatureCollection<LineString>;
              if (clippedLines === undefined) {
                console.log('error');
                return null;
              }
              const bufferedPolygon = buffer(polygon, 0.000001, { units: 'kilometers' });
              const insideSegments = clippedLines.features.filter(segment => booleanContains(bufferedPolygon, segment));
              clipps.features.push(...insideSegments);
            }
          }
        });
      }
    });
  }
  totalClippedList.set(selectedLineLayer.name, clipps);
}

    return totalClippedList;
  }

  function handleClip_2() {
    const totalClippedList = new Map<string, FeatureCollection>(); 
    //Find all selectedlayers
    const [selectedPolyLayers, selectedLineLayers]  = findAllLayers();
    console.log("SelectedLayers", selectedPolyLayers)
    console.log("SelectedLineLayers", selectedLineLayers)
  
    selectedPolyLayers.forEach((polyLayer) => {
      const clipps: FeatureCollection = {
        type: 'FeatureCollection',
        features: [],
      };
  
      const polyFeatures = polyLayer.geoJSON.features.filter((feature) => feature.geometry.type === 'Polygon');
      const mainFeatures = selectedMainLayer?.geoJSON?.features.filter((feature) => feature.geometry.type === 'Polygon');
      if (!mainFeatures || !polyFeatures) {
        return;
      }
  
      mainFeatures.forEach((mainFeature) => {
        polyFeatures.forEach((polyFeature) => {
          const clipped = intersect(mainFeature.geometry as Polygon, polyFeature.geometry as Polygon) as Feature<Polygon | MultiPolygon>;
          if (clipped) {
            clipps.features.push(clipped);
          }
        });
      });
  
      totalClippedList.set(polyLayer.name, clipps);
    });
  
    selectedLineLayers.forEach((selectedLineLayer) => {
      const clipps: FeatureCollection = {
        type: 'FeatureCollection',
        features: [],
      };
  
      const lineFeatures = selectedLineLayer.geoJSON.features.filter((feature) => feature.geometry.type === 'LineString');
      const mainFeatures = selectedMainLayer?.geoJSON?.features.filter((feature) => feature.geometry.type === 'Polygon');
      if (!mainFeatures || !lineFeatures) {
        return;
      }
  
      mainFeatures.forEach((mainFeature) => {
        const polygon = mainFeature.geometry as Polygon;
  
        lineFeatures.forEach((lineFeature) => {
          const line = lineFeature as Feature<LineString>;
  
          if (booleanDisjoint(line, polygon)) {
            return; // Line is completely outside, skip
          }
  
          if (!booleanContains(polygon, line) || booleanCrosses(polygon, line)) {
            // Line intersects with polygon
            const polyLine = polygonToLine(polygon);
            const clippedLines = lineSplit(line, polyLine) as FeatureCollection<LineString>;
  
            if (!clippedLines) {
              console.log('error');
              return null;
            }
  
            const bufferedPolygon = buffer(polygon, 0.000001, { units: 'kilometers' });
            const insideSegments = clippedLines.features.filter(segment => booleanContains(bufferedPolygon, segment));
            clipps.features.push(...insideSegments);
          } else {
            // Line is completely inside
            clipps.features.push(line);
          }
        });
      });
  
      totalClippedList.set(selectedLineLayer.name, clipps);
    });
  
    return totalClippedList;
  }
  


  const handleOk = () => {
    const start = Date.now()
    setIsLoading(true)
    const clipped = handleClip_2();
    clipped?.forEach((value: FeatureCollection, key: string ) => {
        const newObj: GeoJSONItem = {
            id: uid(),
            name: key + "_clip",
            visible: true,
            color: getRandomColor(),
            opacity: 0.5,
            geoJSON: value as FeatureCollection,
          };
    setGeoJSONList((prevGeoJSONs: GeoJSONItem[]) => [...prevGeoJSONs, newObj as GeoJSONItem]);
    });
    setIsLoading(false)
    props.handleCloseModal();
    const end = Date.now();
    console.log(`Execution time: ${end - start} ms`);
    
  };

  const handleChoseLayer1 = (event: ChangeEvent<HTMLInputElement>) => {
    const chosenLayer: GeoJSONItem = geoJSONList.find((layer) => layer.id === event.target.value) as GeoJSONItem;
    setSelectedMainLayer(chosenLayer);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
      {isLoading ? <CircularProgress/> : <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
      <Typography variant="h6">Clipping Tool:</Typography>
      <TextField
        style={{ paddingTop: '10px' }}
        id="Selected-buffer-layer"
        select
        label="Select layer to fit"
        onChange={handleChoseLayer1}
        variant="filled"
        defaultValue=""
      >
        {geoJSONList.map((layer) => (
          <MenuItem key={layer.id} value={layer.id}>
            {layer.name}
          </MenuItem>
        ))}
      </TextField>

      <FormControl sx={{ paddingTop: '10px'}}>
        
        <Select
        style={{margin: 0}}
          labelId="demo-multiple-chip-standard-label"
          id="demo-multiple-chip"
          multiple
          value={layerNames}
          onChange={handleChange}
          input={<TextField select variant="filled" id="select-multi" label="Select layers" children="test"/>}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          //defaultValue={[""]}
          MenuProps={MenuProps}
        >
          {geoJSONList.map((layer) => (
            <MenuItem
              key={layer.id}
              value={layer.name}
              style={getStyles(layer.name, layerNames, theme)}
            >
              {layer.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', paddingTop: '10px' }}>
        <Button variant="outlined" color="error" onClick={props.handleCloseModal}>
          Cancel
        </Button>
        <Button onClick={handleOk} variant="outlined">
          OK
        </Button>
      </Box>
      </Box>}
    </Box>
  );
};

export default Clip;