import React, { useState, ChangeEvent, useRef } from 'react';
import Button from '@mui/material/Button';
import { AlertColor, Box, Typography } from '@mui/material';
import { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import { useGeoJSONContext, GeoJSONItem } from '../context/geoJSONContext';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import union from '@turf/union';
import booleanOverlap from '@turf/boolean-overlap';
import Loading from './loading';
import { modalStyle } from './styledComponents';
import processData from '../utils/flattenAndDissolve';
import { generateColor } from '../utils/genereateColor';
import generateId from '../utils/generateId';
import InfoIcon from '@mui/icons-material/Info';
import Joyride, { StoreHelpers } from 'react-joyride';
import { unionSteps } from '../data/steps/unionSteps';
import makeStyles from '@mui/styles/makeStyles';

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
  const joyrideHelpers = useRef<StoreHelpers | null>(null);

  const { geoJSONList, setGeoJSONList } = useGeoJSONContext();
  const classes = useStyles();

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
          if (booleanOverlap(feature1, feature2)) {
            // Overlap
            const unions = union(feature1, feature2);
            // Check that it is not null and has no overlapping fractions
            if (
              unions !== null &&
              unionsLst.features.every((feat) => !booleanOverlap(unions, feat))
            ) {
              const unionFeature: Feature<Polygon | MultiPolygon> = {
                type: 'Feature',
                properties: { ...feature1.properties, ...feature2.properties }, // combine properties from both input features
                geometry: unions.geometry,
              };
              unionsLst.features.push(unionFeature);
              feature1Added = true;
            }
          }
        });

        if (!feature1Added && unionsLst.features.every((feat) => !booleanOverlap(feature1, feat))) {
          unionsLst.features.push(feature1);
        }
      });
    }
    return unionsLst;
  };

  const handleOk = () => {
    setIsloading(true);
    setTimeout(() => {
      try {
        const unioned = executeUnion();
        if (unioned?.features.length > 0) {
          const newObj: GeoJSONItem = {
            id: generateId(),
            name: createUniqueName(name),
            visible: true,
            color: generateColor(),
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

  const handleFeatureJoyrideCallback = (data: { index: any; type: any }) => {
    const { index, type } = data;
    if (type === 'tour:end' || type === 'step:close') {
      setRunTour(false);
    }
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
          <Joyride
            steps={unionSteps}
            run={runTour}
            getHelpers={(helpers) => {
              joyrideHelpers.current = helpers;
            }}
            callback={handleFeatureJoyrideCallback}
            continuous
            scrollToFirstStep
            showProgress
            showSkipButton
          />
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
