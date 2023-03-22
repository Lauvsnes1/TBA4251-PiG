import React, { useState, ChangeEvent } from 'react';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';
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
  const [layers, setLayers] = useState<string[]>([]);
  const theme = useTheme();

  const { geoJSONList, setGeoJSONList } = useGeoJSONContext();

  const handleChange = (event: SelectChangeEvent<typeof layers>) => {
    const {
      target: { value },
    } = event;
    setLayers(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
    console.log("layers selected:", layers)
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
    const selectedLayers: GeoJSONItem[] = [];
    layers.forEach((item) => {
      const matchingLayer = geoJSONList.find(layer => layer.name === item);
      if (matchingLayer) {
        selectedLayers.push(matchingLayer);
      }
    });
    return selectedLayers;
  };
  
  function handleClip() {
    const totalClippedList = new Map<string, FeatureCollection>(); 

    //Find all selectedlayers
    const selectedLayers: GeoJSONItem[] = findAllLayers();

    //For each selected layer, find and save the intersect with the polygon to clip
    for(let k = 0; k < selectedLayers.length; k++){
        const clipps: FeatureCollection = {
            type: 'FeatureCollection',
            features: [],
          };
    if(selectedMainLayer?.geoJSON && selectedLayers[k]?.geoJSON){
    for (let i = 0; i < (selectedMainLayer?.geoJSON.features.length); i++){
        for (let j = 0; j< (selectedLayers[k]?.geoJSON.features.length); j++){
    if (
      selectedMainLayer?.geoJSON.features[i].geometry.type === "Polygon" &&
      selectedLayers[k]?.geoJSON.features[j].geometry.type === "Polygon"
    ) {
      const clipped = intersect(
        selectedMainLayer.geoJSON.features[i].geometry as Polygon,
        selectedLayers[k].geoJSON.features[j].geometry as Polygon
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
    totalClippedList.set(selectedLayers[k].name ,clipps);
}
    return totalClippedList;
  }

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
          value={layers}
          onChange={handleChange}
          input={<TextField select variant="filled" id="select-multi" label="Select layers"/>}//{<NativeSelect id="select-multiple-chip" variant='outlined'/>}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {geoJSONList.map((layer) => (
            <MenuItem
              key={layer.id}
              value={layer.name}
              style={getStyles(layer.name, layers, theme)}
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