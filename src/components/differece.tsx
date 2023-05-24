import React, { useState, ChangeEvent } from 'react';
import Button from '@mui/material/Button';
import { AlertColor, Box, Typography } from '@mui/material';
import { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import { useGeoJSONContext, GeoJSONItem } from '../context/geoJSONContext';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import difference from '@turf/difference';
import booleanOverlap from '@turf/boolean-overlap';
import booleanIntersects from '@turf/boolean-intersects';
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
import booleanContains from '@turf/boolean-contains';
import buffer from '@turf/buffer';

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

  function handleDifference() {
    const differenceList: FeatureCollection = {
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
            const diff = difference(feature1, feature2);
            if (
              diff !== null &&
              differenceList.features.every((feat) => !booleanOverlap(diff, feat))
            ) {
              const diffFeature: Feature<Polygon | MultiPolygon> = {
                type: 'Feature',
                // combine properties from both input features
                properties: { ...feature1.properties, ...feature2.properties },
                geometry: diff.geometry,
              };
              differenceList.features.push(diffFeature);
              feature1Added = true;
            }
          }
          //Find if isolated fragment must be added
          else if (
            !feature1Added &&
            processed2?.features.every(
              (feat) => !booleanOverlap(feat, feature1) && !booleanContains(feat, feature1)
            )
          ) {
            differenceList.features.push(feature1);
            feature1Added = true;
          }
        });
      });
    }
    //return dissolve(differenceList as FeatureCollection<Polygon, Properties>);
    return differenceList;
  }

  function handleDifference2(): FeatureCollection {
    const differenceList: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    if (selectedLayer1?.geoJSON && selectedLayer2?.geoJSON) {
      const layer1 = selectedLayer1.geoJSON;
      const layer2 = selectedLayer2.geoJSON;

      const { processed1, processed2 } = processData(layer1, layer2);

      const intersectedFeatures: Feature[] = [];

      processed1.features.forEach((feature1) => {
        let feature1Added: boolean = false;
        processed2?.features.forEach((feature2) => {
          if (booleanIntersects(feature1, feature2)) {
            const diff = difference(feature1, feature2);

            if (diff !== null && !feature1Added) {
              const diffFeature: Feature<Polygon | MultiPolygon> = {
                type: 'Feature',
                properties: { ...feature1.properties, ...feature2.properties },
                geometry: diff.geometry,
              };

              differenceList.features.push(diffFeature);
              intersectedFeatures.push(feature1);
              feature1Added = true;
            }
          }
        });
      });

      processed1.features.forEach((feature1) => {
        if (!intersectedFeatures.includes(feature1)) {
          differenceList.features.push(feature1);
        }
      });

      // const remains: any[] = [];
      // processed1.features.forEach((feature1) => {
      //   const remain = differenceList.features.find((feat) =>
      //     booleanOverlap(
      //       feature1,
      //       feat
      //       // buffer(feat, -0.001, {
      //       //   units: 'meters',
      //       // })
      //     )
      //   );
      //   if (remain) {
      //     remains.push(remain);
      //   }
      // });
      // console.log(remains);
      // remains.forEach((element) => {
      //   //const diff = difference(element,)
      // });
    }

    return differenceList;
  }

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
          props.showAlert('success', '');
        } else {
          setIsLoading(false);
          props.showAlert('error', 'Invalid Input');
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
