import React, { useState, ChangeEvent } from 'react';
import Button from '@mui/material/Button';
import { AlertColor, Box, Typography } from '@mui/material';
import { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import { useGeoJSONContext, GeoJSONItem } from '../context/geoJSONContext';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import union from '@turf/union';
import Loading from './loading';
import { modalStyle } from './styledComponents';
import processData from '../utils/flattenAndDissolve';
import { generateColor, generateDistinctColor } from '../utils/genereateColor';
import generateId from '../utils/generateId';
import createUniqueName from '../utils/createUniqueName';
import InfoIcon from '@mui/icons-material/Info';
import { unionSteps } from '../tutorial/steps/unionSteps';
import makeStyles from '@mui/styles/makeStyles';
import Tutorial from '../tutorial/tutorial';
import booleanIntersects from '@turf/boolean-intersects';
import dissolve from '@turf/dissolve';
import { Properties } from '@turf/helpers';

const useStyles = makeStyles({
  hovered: {
    backgroundColor: '#f2f2f2',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
  },
});

function Union(props: {
  handleCloseModal: () => void;
  showAlert: (status: AlertColor, message: string) => void;
}) {
  const [selectedLayer1, setSelectedLayer1] = useState<GeoJSONItem>();
  const [selectedLayer2, setSelectedLayer2] = useState<GeoJSONItem>();
  const [name, setName] = useState<string>('union');
  const [isLoading, setIsloading] = useState(false);
  const [runTour, setRunTour] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const { geoJSONList, setGeoJSONList } = useGeoJSONContext();
  const classes = useStyles();

  // const executeUnion = () => {
  //   const unionsLst: FeatureCollection = {
  //     type: 'FeatureCollection',
  //     features: [],
  //   };
  //   if (selectedLayer1?.geoJSON && selectedLayer2?.geoJSON) {
  //     const layer1 = selectedLayer1.geoJSON;
  //     const layer2 = selectedLayer2.geoJSON;

  //     const { processed1, processed2 } = processData(layer1, layer2);

  //     processed1.features.forEach((feature1) => {
  //       let feature1Added: boolean = false;
  //       processed2?.features.forEach((feature2) => {
  //         if (booleanOverlap(feature1, feature2)) {
  //           // Overlap
  //           const unions = union(feature1, feature2);
  //           // Check that it is not null and has no equal fractions
  //           if (
  //             unions !== null &&
  //             unionsLst.features.every((feat) => !booleanIntersects(unions, feat))
  //           ) {
  //             const unionFeature: Feature<Polygon | MultiPolygon> = {
  //               type: 'Feature',
  //               properties: { ...feature1.properties, ...feature2.properties }, // combine properties from both input features
  //               geometry: unions.geometry,
  //             };
  //             unionsLst.features.push(unionFeature);
  //             feature1Added = true;
  //           }
  //         } else {
  //           unionsLst.features.push(feature2);
  //         }
  //       });

  //       if (!feature1Added && unionsLst.features.every((feat) => !booleanOverlap(feature1, feat))) {
  //         unionsLst.features.push(feature1);
  //       }
  //     });
  //   }

  //   return unionsLst;
  // };

  const executeUnion = () => {
    const unionsLst: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };
    if (selectedLayer1?.geoJSON && selectedLayer2?.geoJSON) {
      const layer1 = selectedLayer1.geoJSON;
      const layer2 = selectedLayer2.geoJSON;

      const { processed1, processed2 } = processData(layer1, layer2);

      processed1.features.forEach((feature1) => {
        let feature1Added: boolean = false;
        processed2?.features.forEach((feature2) => {
          if (booleanIntersects(feature1, feature2)) {
            // Overlap, only necessary to compute union if we have an intersect
            const unions = union(feature1, feature2);
            // Check that it is not null
            if (unions !== null) {
              const unionFeature: Feature<Polygon | MultiPolygon> = {
                type: 'Feature',
                properties: {},
                //properties: { ...feature1.properties, ...feature2.properties }, // combine properties from both input features
                geometry: unions.geometry,
              };
              unionsLst.features.push(unionFeature);
              feature1Added = true;
            }
          } else if (!feature1Added) {
            unionsLst.features.push(feature1);
            unionsLst.features.push(feature2);
            feature1Added = true;
          } else {
            unionsLst.features.push(feature2);
          }
        });
      });
    }
    //We dissolve the result to get rid of duplicates
    return dissolve(unionsLst as FeatureCollection<Polygon, Properties>);
  };

  const handleOk = () => {
    setIsloading(true);
    setTimeout(() => {
      try {
        const unioned = executeUnion();
        if (unioned?.features.length > 0) {
          const newObj: GeoJSONItem = {
            id: generateId(),
            name: createUniqueName(name, geoJSONList),
            visible: true,
            color: generateDistinctColor(geoJSONList),
            opacity: 0.5,
            geoJSON: unioned as FeatureCollection,
          };
          setGeoJSONList((prevGeoJSONs: GeoJSONItem[]) => [...prevGeoJSONs, newObj as GeoJSONItem]);
          setIsloading(false);
          props.handleCloseModal();
          props.showAlert('success', '');
        } else {
          setIsloading(false);
          props.showAlert('error', 'Invalid input');
        }
      } catch (e) {
        setIsloading(false);
        console.log(e);
        props.showAlert('error', 'invalid Input');
      }
    }, 10);
  };

  const handleChoseLayer1 = (event: ChangeEvent<HTMLInputElement>) => {
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
      setSelectedLayer1(chosenLayer);
    } else {
      props.showAlert('warning', 'Please select a polygon layer');
    }
  };

  const handleChoseLayer2 = (event: ChangeEvent<HTMLInputElement>) => {
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
      setSelectedLayer2(chosenLayer);
    } else {
      props.showAlert('warning', 'Please select a polygon layer');
    }
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
          <Tutorial runTour={runTour} steps={unionSteps} setRunTour={setRunTour} />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography id="union-header" variant="h6">
              Union Tool:
            </Typography>
            <InfoIcon
              sx={{ alignContent: 'center' }}
              titleAccess="Tutorial"
              onClick={() => setRunTour(true)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={isHovered ? classes.hovered : ''}
            />
          </Box>
          <TextField
            style={{ paddingTop: '10px' }}
            id="select-first"
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
            id="select-second"
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
            id="costum-name"
            label="Name of output layer"
            onChange={(e) => setName(e.target.value)}
            style={{ paddingTop: '10px' }}
            variant="filled"
            value={name}
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
            <Button id="ok-button" onClick={handleOk} variant="outlined">
              OK
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
export default Union;
