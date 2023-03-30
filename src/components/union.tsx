import React, { useState, ChangeEvent } from 'react';
import Button from '@mui/material/Button';
import { Box, CircularProgress, Modal, Typography } from '@mui/material';
import { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import { useGeoJSONContext, GeoJSONItem } from '../context/geoJSONContext';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { uid } from 'uid';
import union from '@turf/union';
import booleanOverlap from '@turf/boolean-overlap';
import dissolve from '@turf/dissolve';
import { Properties } from '@turf/helpers';
import Loading from './loading';
import { modalStyle } from './styledComponents';


function Union(props: { handleCloseModal: () => void; }) {
  const [selectedLayer1, setSelectedLayer1] = useState<GeoJSONItem>();
  const [selectedLayer2, setSelectedLayer2] = useState<GeoJSONItem>();
  const [name, setName] = useState<string>('union');
  const [isLoading, setIsloading] = useState(false);

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


const excecuteUnion = () => {
  setIsloading(true)
  const unionsLst: FeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  };
  console.log("Layer1", selectedLayer1)
  console.log("Layer2", selectedLayer2)
  if(selectedLayer1?.geoJSON && selectedLayer2?.geoJSON){
    const layer1 = selectedLayer1.geoJSON
    const layer2 = selectedLayer2.geoJSON
    
    const dissolved1 = dissolve(layer1 as FeatureCollection<Polygon, Properties>)
    const dissolved2 = dissolve(layer2 as FeatureCollection<Polygon, Properties>)
    
    dissolved1.features.forEach(feature1 => {
      let feature1Added: boolean = false;
      dissolved2.features.forEach(feature2 => {
        if(booleanOverlap(feature1, feature2)){
          //Overlap
          const unions = union(feature1, feature2)
          //Check that it is not null and has no overlapping fractions
          if(unions !== null && unionsLst.features.every(feat => !booleanOverlap(unions, feat))){
            const unionFeature: Feature<Polygon | MultiPolygon> = {
              type: 'Feature',
              properties: {...feature1.properties, ...feature2.properties}, // combine properties from both input features
              geometry: unions.geometry,
            };
            unionsLst.features.push(unionFeature)
          }
        }
        //Check that it is not added before and has no overlapping fractions of already existing features
        else if(!feature1Added && unionsLst.features.every(feat => !booleanOverlap(feature1, feat))){
          unionsLst.features.push(feature1)
          feature1Added = true
        }
      })
    })
    console.log(unionsLst)
    return unionsLst;
  }
}

  const handleOk = () => {
    setIsloading(true)
    let unioned = excecuteUnion()
    const newObj: GeoJSONItem = {
      id: uid(),
      name: name,
      visible: true,
      color: getRandomColor(),
      opacity: 0.5,
      geoJSON: unioned as FeatureCollection,
    };
    setGeoJSONList((prevGeoJSONs: GeoJSONItem[]) => [...prevGeoJSONs, newObj as GeoJSONItem]);
    setIsloading(false)
    props.handleCloseModal()

  };

  const handleChoseLayer1 = (event: ChangeEvent<HTMLInputElement>) => {
    const chosenLayer: GeoJSONItem = geoJSONList.find((layer) => layer.id === event.target.value) as GeoJSONItem;
    setSelectedLayer1(chosenLayer);
  };

  const handleChoseLayer2 = (event: ChangeEvent<HTMLInputElement>) => {
    const chosenLayer: GeoJSONItem = geoJSONList.find((layer) => layer.id === event.target.value) as GeoJSONItem;
    setSelectedLayer2(chosenLayer);
  };

 return (
    <>
      {isLoading ? ( // Check if isLoading is true
        // If it is, render the loading component
        <Box sx={modalStyle}>
        <Modal open={isLoading}>
       <Loading/>
       </Modal>
       </Box>
      ) : (
        // Otherwise, render the original code
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flexWrap: "wrap",
            width: "100%",
          }}
        >
          <Typography variant="h6">Union Tool:</Typography>

          <TextField
            style={{ paddingTop: "10px" }}
            id="Selected-buffer-layer"
            select
            label="Select layer one"
            onChange={handleChoseLayer1}
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
            style={{ paddingTop: "10px" }}
            id="Selected-buffer-layer"
            select
            label="Select layer two"
            onChange={handleChoseLayer2}
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
            required
            id="outlined-required"
            label="Name of output layer"
            onChange={(e) => setName(e.target.value)}
            style={{ paddingTop: "10px" }}
            variant="filled"
            value={name}
          />
          <div
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              display: "flex",
              paddingTop: "10px",
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
};
export default Union;