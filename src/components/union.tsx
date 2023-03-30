import React, { useState, ChangeEvent } from 'react';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import { Feature, FeatureCollection, GeoJsonProperties, MultiPolygon, Polygon } from 'geojson';
import { useGeoJSONContext, GeoJSONItem } from '../context/geoJSONContext';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { uid } from 'uid';
import union from '@turf/union';
import booleanOverlap from '@turf/boolean-overlap';
import cleanCoords from '@turf/clean-coords';
import dissolve from '@turf/dissolve';
import combine from '@turf/combine';
import { featureCollection, Properties } from '@turf/helpers';

function Union(props: { handleCloseModal: () => void; }) {
  const [selectedLayer1, setSelectedLayer1] = useState<GeoJSONItem>();
  const [selectedLayer2, setSelectedLayer2] = useState<GeoJSONItem>();
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

//   function handleUnion() {
//     const unionsLst: FeatureCollection = {
//         type: 'FeatureCollection',
//         features: [],
//       };
//       console.log("length of polygons list:", selectedLayer1?.geoJSON.features.length, selectedLayer2?.geoJSON.features.length )
//     if(selectedLayer1?.geoJSON && selectedLayer2?.geoJSON){
//     for (let i = 0; i < (selectedLayer1?.geoJSON.features.length); i++){
//         for (let j = 0; j< (selectedLayer2?.geoJSON.features.length); j++){
//     if (
//       selectedLayer1?.geoJSON.features[i].geometry.type === "Polygon" &&
//       selectedLayer2?.geoJSON.features[j].geometry.type === "Polygon"
//     ) {
//       const unions = union(
//         selectedLayer1.geoJSON.features[i].geometry as Polygon,
//         selectedLayer2.geoJSON.features[j].geometry as Polygon
//       ) as Feature<Polygon | MultiPolygon>;
//       if (unions === undefined) {
//         console.log('error')
//         return null;
//       }
//       if(unions !== null){
//         const feature1 = selectedLayer1.geoJSON.features[i];
//         const feature2 = selectedLayer2.geoJSON.features[j];
//         const unionFeature: Feature<Polygon | MultiPolygon> = {
//           type: 'Feature',
//           properties: {...feature1.properties, ...feature2.properties}, // combine properties from both input features
//           geometry: unions.geometry,
//         };
//       const cleanUnionFeature = cleanCoords(unionFeature); 
//       unionsLst.features.push(cleanUnionFeature)
//       }
  
//     }
//     }
//     };
//     return unionsLst;
// }
//   }

// function handleUnion() {
//   const unionsLst: FeatureCollection = {
//     type: 'FeatureCollection',
//     features: [],
//   };
//   const processedPairs = new Set<string>(); // create a set to store IDs of processed pairs
//   if (selectedLayer1?.geoJSON && selectedLayer2?.geoJSON) {
//     for (let i = 0; i < selectedLayer1.geoJSON.features.length; i++) {
//       for (let j = 0; j < selectedLayer2.geoJSON.features.length; j++) {
//         if (
//           selectedLayer1.geoJSON.features[i].geometry.type === 'Polygon' &&
//           selectedLayer2.geoJSON.features[j].geometry.type === 'Polygon'
//         ) {
//           const polygonPairId = `${i}-${j}`; // create an ID for this pair of polygons
//           if (processedPairs.has(polygonPairId)) {
//             // skip this pair if it has already been processed
//             continue;
//           }
//           const unions = union(
//             selectedLayer1.geoJSON.features[i].geometry as Polygon,
//             selectedLayer2.geoJSON.features[j].geometry as Polygon
//           ) as Feature<Polygon | MultiPolygon>;
//           if (unions !== null) {
//             const feature1 = selectedLayer1.geoJSON.features[i];
//             const feature2 = selectedLayer2.geoJSON.features[j];
//             const unionFeature: Feature<Polygon | MultiPolygon> = {
//               type: 'Feature',
//               properties: {
//                 ...feature1.properties,
//                 ...feature2.properties,
//               },
//               geometry: unions.geometry,
//             };
//             unionsLst.features.push(unionFeature);
//             processedPairs.add(polygonPairId); // add the pair to the processed set
//           }
//         }
//       }
//     }
//   }
//   return unionsLst;
// }

function newUnion() {
  const unionsLst: FeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  };
  //const test = featureCollection([...selectedLayer1?.geoJSON.features]);
  //const poly1 = combine(selectedLayer1?.geoJSON );
  //const poly2 = combine(selectedLayer2?.geoJSON)


  if(selectedLayer1?.geoJSON && selectedLayer2?.geoJSON){
    selectedLayer1.geoJSON.features.forEach((feature1) => {
      if(feature1.geometry.type === 'Polygon'){
        selectedLayer2.geoJSON.features.forEach((feature2) => {
          if(feature2.geometry.type === 'Polygon'){
              const unions = union(feature1.geometry as Polygon, feature2.geometry as Polygon);
              if(unions !== null){
                const unionFeature: Feature<Polygon | MultiPolygon> = {
                  type: 'Feature',
                  properties: {...feature1.properties, ...feature2.properties}, // combine properties from both input features
                  geometry: unions.geometry,
                };
                // check if the new feature overlaps with any existing features in the union list
                let overlaps = false;
                for (let k = 0; k < unionsLst.features.length; k++) {
                  const existingFeature = unionsLst.features[k];
                  if (booleanOverlap(existingFeature, unionFeature)) {
                    overlaps = true;
                    break;
                  }
                }
              if(!overlaps){
              const cleanUnionFeature = cleanCoords(unionFeature); 
              unionsLst.features.push(unionFeature)
              }
          }
        
          }
        })
      }
    })
  }
  //const cleanedList = removeDuplicatePolygons(unionsLst as FeatureCollection<Polygon | MultiPolygon, GeoJsonProperties>)
  return unionsLst;
}

function finalUnion() {
  console.log("Layer1", selectedLayer1)
  console.log("Layer2", selectedLayer2)
  const unionsLst: FeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  };
  if(selectedLayer1?.geoJSON && selectedLayer2?.geoJSON){
    const layer1 = selectedLayer1.geoJSON.features
    const layer2 = selectedLayer2.geoJSON.features

    layer1.forEach((feature1) => {
      layer2.forEach((feature2) => {
        if(feature1.geometry.type === 'Polygon' && feature2.geometry.type ==='Polygon'){
        const unions = union(feature1.geometry as Polygon, feature2.geometry as Polygon);
        if(unions !== null){
          const unionFeature: Feature<Polygon | MultiPolygon> = {
            type: 'Feature',
            properties: {...feature1.properties, ...feature2.properties}, // combine properties from both input features
            geometry: unions.geometry,
          };
          let overlaps = false;
          for (let k = 0; k < unionsLst.features.length; k++) {
            const existingFeature = unionsLst.features[k];
            if (booleanOverlap(existingFeature, unionFeature)) {
              console.log("TRUE for", feature2)
              overlaps = true;
              break;
            }
            console.log("False for:", feature2 )
          }
        if(!overlaps){ 
        unionsLst.features.push(unionFeature)
        }
        }
        }
      })

    })

}
console.log(unionsLst)
return unionsLst;
}

function unionTry() {
  console.log("Layer1", selectedLayer1)
  console.log("Layer2", selectedLayer2)
  const unionsLst: FeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  };
  const dummy = {
    "coordinates": [
      [
        [
          10.39559541217099,
          63.45961671218359
        ],
        [
          10.393081199570531,
          63.45952378126407
        ],
        [
          10.395073640743533,
          63.458064842342736
        ],
        [
          10.39683457679024,
          63.458553564152
        ],
        [
          10.39559541217099,
          63.45961671218359
        ]
      ]
    ],
    "type": "Polygon"
  }

  if(selectedLayer1?.geoJSON && selectedLayer2?.geoJSON){
    const layer1 = selectedLayer1.geoJSON.features
    const layer2 = selectedLayer2.geoJSON.features

    //First union forced
    const firstUnion = union(layer1[0].geometry as Polygon, dummy as Polygon)
    if(firstUnion !== null){
      unionsLst.features.push(firstUnion)
    }
    for (let k = 1; k < layer1.length; k++){
      const unions = union(layer1[k].geometry as Polygon, unionsLst.features[0].geometry as Polygon)
      let overlaps = false;
      if(unions !== null){
      for (let k = 0; k < unionsLst.features.length; k++) {
        const existingFeature = unionsLst.features[k];
        if (booleanOverlap(existingFeature, unions)) {
          //console.log("TRUE for", feature2)
          overlaps = true;
          break;
        }
        //console.log("False for:", feature2 )
      }
    if(!overlaps){ 
    unionsLst.features.push(unions)
    }
    }
  }

   
}
return unionsLst;
}



function removeDuplicatePolygons(layer: FeatureCollection<Polygon | MultiPolygon>): FeatureCollection<Polygon | MultiPolygon> {
  // Create an empty array to store unique polygons
  const uniquePolygons: Feature<Polygon | MultiPolygon>[] = [];

  // Loop through each feature in the layer
  layer.features.forEach((feature) => {
    // Check if the feature is a polygon or a multipolygon
    if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
      // Convert the geometry to a string to check for duplicates
      const geometryString = JSON.stringify(feature.geometry);

      // Check if the string representation of the geometry has already been added to the array
      if (!uniquePolygons.some((p) => JSON.stringify(p.geometry) === geometryString)) {
        // Add the feature to the unique array if it hasn't been added before
        uniquePolygons.push(feature);
      }
    }
  });

  // Create a new FeatureCollection with the unique polygons
  const uniqueLayer: FeatureCollection<Polygon | MultiPolygon> = {
    type: 'FeatureCollection',
    features: uniquePolygons,
  };

  return uniqueLayer;
}

const unionDissolve= () => {
  const unionsLst: FeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  };
  console.log("Layer1", selectedLayer1)
  console.log("Layer2", selectedLayer2)
  if(selectedLayer1?.geoJSON && selectedLayer2?.geoJSON){
    const layer1 = featureCollection(selectedLayer1.geoJSON.features)
    const layer2 = selectedLayer2.geoJSON
    
    const dissolved1 = dissolve(layer1 as FeatureCollection<Polygon, Properties>)
    const dissolved2 = dissolve(layer2 as FeatureCollection<Polygon, Properties>)
    console.log("dissolved1", dissolved1)
    console.log("dissolved2", dissolved2)

    dissolved1.features.forEach(feature1 => {
      dissolved2.features.forEach(feature2 => {
        let feat1Added: boolean = false;
        if(booleanOverlap(feature1, feature2)){
          //Overlap
          console.log("Overlap")
          const unions = union(feature1, feature2)
          if(unions !== null){
            const unionFeature: Feature<Polygon | MultiPolygon> = {
              type: 'Feature',
              properties: {...feature1.properties, ...feature2.properties}, // combine properties from both input features
              geometry: unions.geometry,
            };
            unionsLst.features.push(unionFeature)
          }
        }
        else if(feat1Added){
          //No overlap, just add to final list
          console.log("no overlap")
          unionsLst.features.push(feature1)
          feat1Added = true; 
        }
        else{
          console.log("No overlap")
        }
      })

    })
    console.log(unionsLst)
    return unionsLst;
  }
}


  const handleOk = () => {
    let unioned = unionDissolve() //as FeatureCollection<Polygon | MultiPolygon, GeoJsonProperties>;
    //unioned = removeDuplicatePolygons(unioned)
    const newObj: GeoJSONItem = {
      id: uid(),
      name: name,
      visible: true,
      color: getRandomColor(),
      opacity: 0.5,
      geoJSON: unioned as FeatureCollection,
    };
    setGeoJSONList((prevGeoJSONs: GeoJSONItem[]) => [...prevGeoJSONs, newObj as GeoJSONItem]);
    props.handleCloseModal();
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
    <div style={{display: "flex", flexDirection: "column",  justifyContent: "center", flexWrap: 'wrap', width: '100%' }}>
        <Typography variant="h6"> Union Tool:</Typography>
      
        <TextField
          style={{paddingTop: '10px'}}
          id="Selected-buffer-layer"
          select
          label="Select layer one"
          onChange={handleChoseLayer1}
          variant="filled"
          defaultValue={""}
        >
          {geoJSONList.map((layer) => (
            <MenuItem key={layer.id} value={layer.id} >
              {layer.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          style={{paddingTop: '10px'}}
          id="Selected-buffer-layer"
          select
          label="Select layer two"
          onChange={handleChoseLayer2}
          variant="filled"
          defaultValue={""}
        >
          {geoJSONList.map((layer) => (
            <MenuItem key={layer.id} value={layer.id} >
              {layer.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          required
          id="outlined-required"
          label="Name of output layer"
          onChange={(e) => setName(e.target.value)}
          style={{paddingTop: '10px'}}
          variant="filled"
        />
      <div style={{flexDirection: 'row', justifyContent: 'space-around', display: 'flex', paddingTop: '10px'}}>
      <Button variant="outlined" color="error" onClick={props.handleCloseModal}>Cancel</Button>
      <Button onClick={handleOk} variant="outlined">OK</Button>
      </div>
    </div>
    
  );
}
export default Union;