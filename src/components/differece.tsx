import React, { useState, ChangeEvent } from 'react';
import Button from '@mui/material/Button';
import { AlertColor, Box, Typography } from '@mui/material';
import { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import { useGeoJSONContext, GeoJSONItem } from '../context/geoJSONContext';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import difference from '@turf/difference';
import Loading from './loading';
import { modalStyle } from './styledComponents';
import processData from '../utils/flattenAndDissolve';
import { generateDistinctColor } from '../utils/genereateColor';
import createUniqueName from '../utils/createUniqueName';
import generateId from '../utils/generateId';
import Tutorial from '../tutorial/tutorial';
import { differenceSteps } from '../tutorial/steps/differenceSteps';
import makeStyles from '@mui/styles/makeStyles';
import InfoIcon from '@mui/icons-material/Info';
import { Properties } from '@turf/helpers';
import booleanDisjoint from '@turf/boolean-disjoint';
import booleanIntersects from '@turf/boolean-intersects';

const useStyles = makeStyles({
  hovered: {
    backgroundColor: '#f2f2f2',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
  },
});

function Difference(props: {
  handleCloseModal: () => void;
  showAlert: (status: AlertColor, message: string) => void;
}) {
  const [selectedLayer1, setSelectedLayer1] = useState<GeoJSONItem>();
  const [selectedLayer2, setSelectedLayer2] = useState<GeoJSONItem>();
  const [name, setName] = useState<string>('difference');
  const [isLoading, setIsLoading] = useState(false);
  const [runTour, setRunTour] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const { geoJSONList, setGeoJSONList } = useGeoJSONContext();
  const classes = useStyles();

  const handleDifference = () => {
    const differenceList: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };
    const intersectionMap: Map<
      Feature<Polygon, Properties>,
      Feature<Polygon, Properties>[]
    > = new Map<Feature<Polygon, Properties>, Feature<Polygon, Properties>[]>();

    if (selectedLayer1?.geoJSON && selectedLayer2?.geoJSON) {
      const layer1 = selectedLayer1.geoJSON;
      const layer2 = selectedLayer2.geoJSON;

      const { processed1, processed2 } = processData(layer1, layer2);

      //find all segments that intersects and allocate in map
      processed1.features.forEach((feature1) => {
        intersectionMap.set(feature1, []);
        processed2?.features.forEach((feature2) => {
          //if the geometries intersect we add to the list of intersecting geometries
          if (booleanIntersects(feature1, feature2)) {
            intersectionMap.get(feature1)?.push(feature2);
          }
        });
      });

      //We compute the difference between each segment of layer 1 and all the ones it intersects with
      Array.from(intersectionMap.entries()).forEach(([feature, intersectingFeatures]) => {
        let isCovered: boolean = false;
        let diff: Feature<Polygon | MultiPolygon, Properties> = feature;
        if (intersectingFeatures.length === 0) {
          //if geometry is disjoint from all geometries in processed2 it is an outlier and needs to be included
          if (processed2?.features.every((feat) => booleanDisjoint(feature, feat))) {
            differenceList.features.push(feature);
          }
        } else {
          //Compute the differnce recursive for all intersecting geometries recursicvely
          for (let i = 0; i < intersectingFeatures.length; i++) {
            const tempDiff = difference(diff, intersectingFeatures[i]);
            if (tempDiff) {
              diff = tempDiff;
            } else {
              isCovered = true;
            }
          }
          if (!isCovered) {
            differenceList.features.push(diff);
          }
        }
      });
    } else {
      props.showAlert('warning', 'Select layers first');
    }
    return differenceList;
  };

  const handleOk = () => {
    setIsLoading(true);
    setTimeout(() => {
      try {
        let differenced = handleDifference();
        if (differenced?.features.length > 0) {
          const newObj: GeoJSONItem = {
            id: generateId(),
            name: createUniqueName(name, geoJSONList),
            visible: true,
            color: generateDistinctColor(geoJSONList),
            opacity: 0.5,
            geoJSON: differenced as FeatureCollection,
          };
          setGeoJSONList((prevGeoJSONs: GeoJSONItem[]) => [...prevGeoJSONs, newObj as GeoJSONItem]);
          setIsLoading(false);
          props.handleCloseModal();
          props.showAlert('success', 'successfully excecuted');
        } else {
          setIsLoading(false);
          props.showAlert('error', 'Empty result');
        }
      } catch (e) {
        console.log(e);
        setIsLoading(false);
        props.showAlert('error', 'Invalid Input');
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
          <Tutorial runTour={runTour} steps={differenceSteps} setRunTour={setRunTour} />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography id="difference-header" variant="h6">
              Difference Tool:
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
            id="select-layer-1"
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
            id="select-layer-2"
            select
            label="Select layer to subtract"
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
            id="custom-name"
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
            <Button id="ok-button" onClick={handleOk} variant="outlined">
              OK
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
export default Difference;
