import React, { useState, ChangeEvent, useEffect } from 'react';
import Button from '@mui/material/Button';
import {
  AlertColor,
  Box,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { FeatureCollection } from 'geojson';
import { useGeoJSONContext, GeoJSONItem } from '../context/geoJSONContext';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InfoIcon from '@mui/icons-material/Info';
import { modalStyle } from './styledComponents';
import Loading from './loading';
import { generateColor, generateDistinctColor } from '../utils/genereateColor';
import generateId from '../utils/generateId';
import determineOpacity from '../utils/determineOpacity';
import makeStyles from '@mui/styles/makeStyles';
import { featureExtractorSteps } from '../tutorial/steps/featureExtractorSteps';
import Tutorial from '../tutorial/tutorial';

const useStyles = makeStyles({
  hovered: {
    backgroundColor: '#f2f2f2',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
  },
});

function FeatureExtractor(props: {
  handleCloseModal: () => void;
  showAlert: (status: AlertColor, message: string) => void;
}) {
  const [selectedLayer, setSelectedLayer] = useState<GeoJSONItem>();
  const [selectedValues, setSelectedValues] = useState<(string | number)[]>([]);
  const [selectedOperations, setSelectedOperations] = useState<string[]>([]);
  const { geoJSONList, setGeoJSONList } = useGeoJSONContext();
  const [uniqueProperties, setUniqueProperties] = useState<string[]>([]);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [numRules, setNumRules] = useState<number>(1);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [runTour, setRunTour] = useState<boolean>(false);
  const classes = useStyles();

  const operations: string[] = ['=', '≠', '<', '>'];

  useEffect(() => {
    // create a Set to store the unique properties
    const uniqueProperties = new Set<string>();

    // loop through each feature in the GeoJSON
    selectedLayer?.geoJSON.features.forEach((feature) => {
      // loop through each property in the feature
      for (const key in feature.properties) {
        // check if the property is not a function and is not already in the Set
        if (
          Object.prototype.hasOwnProperty.call(feature.properties, key) &&
          !uniqueProperties.has(key)
        ) {
          // if it's not, add it to the Set
          uniqueProperties.add(key);
        }
      }
    });

    // convert the Set to an array and update the state
    setUniqueProperties(Array.from(uniqueProperties));
  }, [selectedLayer]);

  const handleChoseProperty = (event: SelectChangeEvent) => {
    setSelectedProperties([...selectedProperties, event.target.value]);
  };

  const handleChoseOperation = (event: SelectChangeEvent) => {
    setSelectedOperations([...selectedOperations, event.target.value]);
  };

  const handleExtract = () => {
    const extracted: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    for (let i = 0; i < numRules; i++) {
      let target: number | string = selectedValues[i];
      //If input is a number, convert to number for easier comparison
      if (!isNaN(+target)) {
        target = Number(target);
      }
      switch (selectedOperations[i]) {
        case '=':
          if (
            selectedLayer &&
            selectedLayer.geoJSON.features &&
            selectedLayer.geoJSON.features.length > 0
          ) {
            const matchingFeatures = selectedLayer.geoJSON.features.filter((feature) => {
              // loop through each property in the feature
              for (const key in feature.properties) {
                if (
                  Object.prototype.hasOwnProperty.call(feature.properties, key) &&
                  feature.properties[key] === target
                ) {
                  // if it matches, return true to include the feature in the filtered array
                  return true;
                }
              }
              // if none of the properties match, return false to exclude the feature from the filtered array
              return false;
            });
            matchingFeatures.forEach((feat) => extracted.features.push(feat));
          }
          break;

        case '≠':
          if (
            selectedLayer &&
            selectedLayer.geoJSON.features &&
            selectedLayer.geoJSON.features.length > 0
          ) {
            const matchingFeatures = selectedLayer.geoJSON.features.filter((feature) => {
              // loop through each property in the feature
              for (const key in feature.properties) {
                if (
                  Object.prototype.hasOwnProperty.call(feature.properties, key) &&
                  feature.properties[key] === target
                ) {
                  // if it does, return true to include the feature in the filtered array
                  return false;
                }
              }
              // if none of the properties match, return false to exclude the feature from the filtered array
              return true;
            });
            matchingFeatures.forEach((feat) => extracted.features.push(feat));
          }
          break;
        case '>':
          if (
            selectedLayer &&
            selectedLayer.geoJSON.features &&
            selectedLayer.geoJSON.features.length > 0
          ) {
            const matchingFeatures = selectedLayer.geoJSON.features.filter((feature) => {
              // loop through each property in the feature
              for (const key in feature.properties) {
                if (Object.prototype.hasOwnProperty.call(feature.properties, key)) {
                  const propValue = feature.properties[key];
                  if (
                    typeof propValue === 'number' &&
                    propValue > Number(target) &&
                    feature.properties[key] != null
                  ) {
                    // if the property is a number and is greater than the selected value,
                    // return true to include the feature in the filtered array
                    return true;
                  }
                }
              }
              // if none of the properties match, return false to exclude the feature from the filtered array
              return false;
            });
            matchingFeatures.forEach((feat) => extracted.features.push(feat));
          }
          break;
        case '<':
          if (
            selectedLayer &&
            selectedLayer.geoJSON.features &&
            selectedLayer.geoJSON.features.length > 0
          ) {
            const matchingFeatures = selectedLayer.geoJSON.features.filter((feature) => {
              // loop through each property in the feature
              for (const key in feature.properties) {
                if (
                  Object.prototype.hasOwnProperty.call(feature.properties, key) &&
                  feature.properties[key] != null &&
                  feature.properties[key] < target
                ) {
                  // if it is, return true to include the feature in the filtered array
                  return true;
                }
              }
              // if none of the properties match, return false to exclude the feature from the filtered array
              return false;
            });
            matchingFeatures.forEach((feat) => extracted.features.push(feat));
          }
          break;

        default:
          break;
      }
    }
    setNumRules(1);
    setSelectedOperations([]);
    setSelectedProperties([]);
    setSelectedValues([]);

    return extracted;
  };

  const handleOk = () => {
    setIsLoading(true);
    setTimeout(() => {
      const extract = handleExtract();
      if (extract.features.length === 0) {
        props.showAlert('warning', 'no features matching you query');
        setIsLoading(false);
      } else {
        const newObj: GeoJSONItem = {
          id: generateId(),
          name: selectedLayer?.name + '_ext',
          visible: true,
          color: generateDistinctColor(geoJSONList),
          opacity: determineOpacity(extract),
          geoJSON: extract as FeatureCollection,
        };

        setGeoJSONList((prevGeoJSONs: GeoJSONItem[]) => [...prevGeoJSONs, newObj as GeoJSONItem]);
        setIsLoading(false);
        props.handleCloseModal();
      }
    }, 10);
  };

  const handleChoseLayer = (event: ChangeEvent<HTMLInputElement>) => {
    const chosenLayer: GeoJSONItem = geoJSONList.find(
      (layer) => layer.id === event.target.value
    ) as GeoJSONItem;
    setSelectedLayer(chosenLayer);
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
          <Tutorial runTour={runTour} steps={featureExtractorSteps} setRunTour={setRunTour} />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography id="feature-ex-header" variant="h6">
              {' '}
              Feature extractor:
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
            id="select-layer"
            select
            label="Select layer:"
            onChange={handleChoseLayer}
            variant="filled"
            defaultValue={''}
          >
            {geoJSONList.map((layer) => (
              <MenuItem key={layer.id} value={layer.id}>
                {layer.name}
              </MenuItem>
            ))}
          </TextField>
          {Array.from({ length: numRules }).map((_, index) => (
            <div
              key={index}
              id={`rule-${index}`}
              style={{ flexDirection: 'row', display: 'flex', justifyContent: 'space-between' }}
            >
              <FormControl sx={{ mt: 1, width: 150 }}>
                <Typography variant="subtitle1" fontSize={1}>
                  <InputLabel sx={{ fontSize: 12 }} id="demo-multiple-chip-label">
                    Select Property
                  </InputLabel>
                </Typography>
                <Select
                  id="select-prop"
                  variant="filled"
                  //value={selectedProperties[index]}
                  onChange={handleChoseProperty}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                  defaultValue=""
                >
                  <MenuItem value=""></MenuItem>
                  {uniqueProperties.map((prop) => (
                    <MenuItem key={prop} value={prop}>
                      {prop}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ m: 1, minWidth: 80 }}>
                <InputLabel id="demo-multiple-chip-label">Operation</InputLabel>
                <Select
                  variant="filled"
                  labelId="demo-simple-select-helper-label"
                  id="select-operation"
                  //value={operation}
                  label="Operation"
                  onChange={handleChoseOperation}
                  defaultValue=""
                >
                  {operations.map((operation) => (
                    <MenuItem key={operation} value={operation}>
                      {operation}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ mt: 1, width: 150 }}>
                <TextField
                  id={`rule-${index}-value`}
                  variant="filled"
                  label="Value"
                  onChange={(e) => {
                    const newSelectedValues = [...selectedValues];
                    newSelectedValues[index] = e.target.value;
                    setSelectedValues(newSelectedValues);
                  }}
                ></TextField>
              </FormControl>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              id="add-rule-button"
              variant="contained"
              style={{ backgroundColor: '#2975a0' }}
              onClick={() => setNumRules(numRules + 1)}
            >
              Add Rule
            </Button>
          </div>

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
            <Button id="ok-button" variant="outlined" onClick={handleOk} sx={{ color: '#2975a0' }}>
              OK
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
export default FeatureExtractor;
