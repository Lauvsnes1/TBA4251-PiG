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
    //For each selected layer, find and save the intersect with the polygon to clip
    for(let k = 0; k < selectedPolyLayers.length; k++){
        const clipps: FeatureCollection = {
            type: 'FeatureCollection',
            features: [],
          };
    if(selectedMainLayer?.geoJSON && selectedPolyLayers[k]?.geoJSON){
    for (let i = 0; i < (selectedMainLayer?.geoJSON.features.length); i++){
        for (let j = 0; j< (selectedPolyLayers[k]?.geoJSON.features.length); j++){
    if (
      selectedMainLayer?.geoJSON.features[i].geometry.type === "Polygon" &&
      selectedPolyLayers[k]?.geoJSON.features[j].geometry.type === "Polygon"
    ) {
      const clipped = intersect(
        selectedMainLayer.geoJSON.features[i].geometry as Polygon,
        selectedPolyLayers[k].geoJSON.features[j].geometry as Polygon
      ) as Feature<Polygon | MultiPolygon>;
      if (clipped === undefined) {
        console.log('error')
        return null;
      }
      if(clipped !== null){ 
      clipps.features.push(clipped)
      }
  
    }

    }
    }};
    totalClippedList.set(selectedPolyLayers[k].name ,clipps);
}

//For Line clipping
for(let k = 0; k< selectedLineLayers.length; k++){
  const clipps: FeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  }; 
  if(selectedMainLayer?.geoJSON && selectedLineLayers[k]?.geoJSON){
    for (let i = 0; i < (selectedMainLayer?.geoJSON.features.length); i++){
      for (let j = 0; j< (selectedLineLayers[k]?.geoJSON.features.length); j++){
        if(selectedMainLayer?.geoJSON.features[i].geometry.type === "Polygon" &&
          selectedLineLayers[k]?.geoJSON.features[j].geometry.type === "LineString"){
          const line = selectedLineLayers[k]?.geoJSON.features[j] as Feature<LineString>;
          const polygon = selectedMainLayer?.geoJSON.features[i].geometry as Polygon;
          //const lineTest = selectedLineLayers[k]?.geoJSON.features[j];
          //console.log('line test:', lineTest)
          if(booleanDisjoint(line, selectedMainLayer?.geoJSON.features[i])){
                //is outside the polygon
            console.log('Line is completely outside')
            }

          if(booleanContains(polygon, line) && !booleanCrosses(polygon, line)){
              //is completely inside
              console.log("line is completely inside")
              clipps.features.push(line)
              }
          //for the remaining lines that intersect with the polygon
          
          const polyLine = polygonToLine(polygon);
          const clippedLines = lineSplit(line, polyLine) as FeatureCollection<LineString>;
          if (clippedLines === undefined) {
            console.log('error')
            return null;
            }
          
          if(clippedLines !== null){
          //Now we check which line segments are inside the polygon
          const bufferedPolygon = buffer(polygon, 0.000001, { units: 'kilometers' });
          const insideSegments = clippedLines.features.filter(segment => {
            const isInside = booleanContains(bufferedPolygon, segment);
            return isInside;
          });
          insideSegments.forEach(segment => {
            clipps.features.push(segment);
          });

          // The way to do it with the center technique
          // for(let x= 0; x< clippedLines.features.length; x++){
          //   let c = center(clippedLines.features[x]);
          //   if(booleanContains(polygon, c)){
          //     console.log(booleanContains(polygon, c));
          //     clipps.features.push(clippedLines.features[x])
          //   }

          // }
          
          }
}
     }
    }

  }
  totalClippedList.set(selectedLineLayers[k].name ,clipps);

}

    return totalClippedList;
  }

  // const clipLines = (selectedLineLayers: GeoJSONItem[]) => {
  //   const lines: FeatureCollection = {
  //     type: 'FeatureCollection',
  //     features: [],
  //   }; 
  //   for(let k = 0; k< selectedLineLayers.length; k++){    
  //     if(selectedMainLayer?.geoJSON && selectedLineLayers[k]?.geoJSON){
  //       for (let i = 0; i < (selectedMainLayer?.geoJSON.features.length); i++){
  //         for (let j = 0; j< (selectedLineLayers[k]?.geoJSON.features.length); j++){
  //           if(selectedMainLayer?.geoJSON.features[i].geometry.type === "Polygon" &&
  //             selectedLineLayers[k]?.geoJSON.features[j].geometry.type === "LineString"){
  //             console.log('came here!!')
  //             const lineTest = selectedLineLayers[k]?.geoJSON.features[j] as Feature<LineString>;
  //             const bbox = selectedMainLayer?.geoJSON.features[i].bbox as BBox;
  //             const res = bboxClip(lineTest, bbox);
              
  //             lines.features.push(res)

  //             if(booleanDisjoint(lineTest, selectedMainLayer?.geoJSON.features[i])){
  //               //is outside the polygon
  //               console.log('Line is outside')
  //               break;
  //             }
  //             if(booleanContains(selectedMainLayer?.geoJSON.features[i].geometry as Polygon, lineTest)){
  //               //is completely inside

  //             }
  //             const poly = polygonToLine(selectedMainLayer?.geoJSON.features[i].geometry as Polygon);
  //             const line = selectedLineLayers[k]?.geoJSON.features[j] as Feature<LineString>;
  //             const clippedLines = lineSplit(line, poly) as FeatureCollection<LineString>;
  //             if (clippedLines === undefined) {
  //               console.log('error')
  //               return null;
  //               }
  //             console.log("ClippedLines", clippedLines)
  //             console.log(line)
              
  //             if(clippedLines !== null){
  //             for(let l = 0; l < clippedLines.features.length; l++){
  //               const rdmPoint = point(clippedLines.features[l].geometry.coordinates[0])
  //               // console.log('point', rdmPoint)
  //               // console.log('polygon', selectedMainLayer?.geoJSON.features[i].geometry as Polygon)
  //               // console.log("booleanContains(clippedLines.features[l], poly)", booleanPointInPolygon(rdmPoint, selectedMainLayer?.geoJSON.features[i].geometry as Polygon, {ignoreBoundary: true}))
  //               console.log(booleanDisjoint(selectedMainLayer?.geoJSON.features[i].geometry as Polygon, clippedLines.features[l]))
  //               if(booleanPointInPolygon(rdmPoint, selectedMainLayer?.geoJSON.features[i].geometry as Polygon)){
                  
  //               lines.features.push(clippedLines.features[l])
  //               }
  //             }
  //           }
      
  //   }
    
    
  //         }
  //       }
    
  //     }
  //     totalClippedList.set(selectedLineLayers[k].name ,clipps);
    
  //   }
  //   return lines;

  // }

  const handleOk = () => {
    const clipped = handleClip();
    clipped?.forEach((value: FeatureCollection, key: string ) => {
        const newObj: GeoJSONItem = {
            id: uid(),
            name: key + "_clip",
            visible: true,
            color: getRandomColor(),
            geoJSON: value as FeatureCollection,
          };
    setGeoJSONList((prevGeoJSONs: GeoJSONItem[]) => [...prevGeoJSONs, newObj as GeoJSONItem]);
    });
    props.handleCloseModal();
  };

  const handleChoseLayer1 = (event: ChangeEvent<HTMLInputElement>) => {
    const chosenLayer: GeoJSONItem = geoJSONList.find((layer) => layer.id === event.target.value) as GeoJSONItem;
    setSelectedMainLayer(chosenLayer);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
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

      <FormControl sx={{ m: 1, paddingTop: '10px'}}>
        
        <Select
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
    </Box>
  );
};

export default Clip;