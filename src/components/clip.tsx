/* eslint-disable no-loop-func */
/* eslint-disable react/prop-types */
import React, { useState, ChangeEvent } from 'react';
import Button from '@mui/material/Button';
import { AlertColor, FilledInput, Typography } from '@mui/material';
import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
  LineString,
  MultiPolygon,
  Polygon,
} from 'geojson';
import { useGeoJSONContext, GeoJSONItem } from '../context/geoJSONContext';
import TextField from '@mui/material/TextField';
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import makeStyles from '@mui/styles/makeStyles';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import InputLabel from '@mui/material/InputLabel';
import intersect from '@turf/intersect';
import { polygonToLine } from '@turf/polygon-to-line';
import lineSplit from '@turf/line-split';
import booleanCrosses from '@turf/boolean-crosses';
import booleanContains from '@turf/boolean-contains';
import booleanDisjoint from '@turf/boolean-disjoint';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import buffer from '@turf/buffer';
import Loading from './loading';
import InfoIcon from '@mui/icons-material/Info';
import { modalStyle } from './styledComponents';
import { generateDistinctColor } from '../utils/genereateColor';
import generateId from '../utils/generateId';
import determineOpacity from '../utils/determineOpacity';
import { Point } from '@turf/helpers';
import { clipSteps } from '../tutorial/steps/clipSteps';
import Tutorial from '../tutorial/tutorial';

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

const useStyles = makeStyles({
  hovered: {
    backgroundColor: '#f2f2f2',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
  },
});

function Clip(props: {
  handleCloseModal: () => void;
  showAlert: (status: AlertColor, message: string) => void;
}) {
  const [selectedMainLayer, setSelectedMainLayer] = useState<GeoJSONItem>();
  const [layerNames, setLayerNames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [runTour, setRunTour] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const theme = useTheme();
  const classes = useStyles();

  const { geoJSONList, setGeoJSONList } = useGeoJSONContext();

  const handleChange = (event: SelectChangeEvent<typeof layerNames>) => {
    const {
      target: { value },
    } = event;
    setLayerNames(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const findAllLayers = () => {
    const selectedPolygonLayers: GeoJSONItem[] = [];
    const selectedLineStringLayers: GeoJSONItem[] = [];
    const selectedPointLayers: GeoJSONItem[] = [];

    layerNames.forEach((item) => {
      const matchingLayer = geoJSONList.find((layer) => layer.name === item);
      if (
        matchingLayer &&
        (matchingLayer.geoJSON.features[0].geometry.type === 'Polygon' ||
          matchingLayer.geoJSON.features[0].geometry.type === 'MultiPolygon')
      ) {
        selectedPolygonLayers.push(matchingLayer);
      } else if (
        matchingLayer &&
        (matchingLayer.geoJSON.features[0].geometry.type === 'LineString' ||
          matchingLayer.geoJSON.features[0].geometry.type === 'MultiLineString')
      ) {
        selectedLineStringLayers.push(matchingLayer);
      } else if (
        matchingLayer &&
        (matchingLayer.geoJSON.features[0].geometry.type === 'Point' ||
          matchingLayer.geoJSON.features[0].geometry.type === 'MultiPoint')
      ) {
        selectedPointLayers.push(matchingLayer);
      }
    });
    return [selectedPolygonLayers, selectedLineStringLayers, selectedPointLayers];
  };

  function handleClip() {
    const totalClippedList = new Map<string, FeatureCollection>();
    //Find all selectedlayers
    const [selectedPolyLayers, selectedLineLayers, selectedPointLayers] = findAllLayers();

    const mainFeatures: Feature<Geometry, GeoJsonProperties>[] | undefined =
      selectedMainLayer?.geoJSON?.features.filter(
        (feature) => feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon'
      );

    selectedPolyLayers.forEach((polyLayer) => {
      const clipps: FeatureCollection = {
        type: 'FeatureCollection',
        features: [],
      };

      const polyFeatures = polyLayer.geoJSON.features.filter(
        (feature) => feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon'
      );

      if (!mainFeatures || !polyFeatures) {
        return;
      }

      mainFeatures.forEach((mainFeature) => {
        polyFeatures.forEach((polyFeature) => {
          const clipped = intersect(
            mainFeature.geometry as Polygon | MultiPolygon,
            polyFeature.geometry as Polygon | MultiPolygon
          ) as Feature<Polygon | MultiPolygon>;
          if (clipped) {
            const originalFeature = polyFeature as Feature<Polygon>; // cast to Polygon feature for access to properties
            const clippedFeature = {
              type: 'Feature',
              properties: originalFeature.properties, // copy properties from original feature
              geometry: clipped.geometry,
            };
            clipps.features.push(clippedFeature as Feature<Geometry, GeoJsonProperties>);
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

      const lineFeatures = selectedLineLayer.geoJSON.features.filter(
        (feature) =>
          feature.geometry.type === 'LineString' || feature.geometry.type === 'MultiLineString'
      );
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
              return null;
            }

            const bufferedPolygon = buffer(polygon, 0.00001, { units: 'kilometers' });
            const insideSegments = clippedLines.features.filter((segment) =>
              booleanContains(bufferedPolygon, segment)
            );
            clipps.features.push(...insideSegments);
          } else {
            // Line is completely inside
            clipps.features.push(line);
          }
        });
      });

      totalClippedList.set(selectedLineLayer.name, clipps);
    });

    selectedPointLayers.forEach((pointLayer) => {
      const clipps: FeatureCollection = {
        type: 'FeatureCollection',
        features: [],
      };

      const pointFeatures = pointLayer.geoJSON.features.filter(
        (feature) => feature.geometry.type === 'Point'
      );
      if (!mainFeatures || !pointFeatures) {
        return;
      }
      mainFeatures.forEach((mainFeature) => {
        const polygon = mainFeature.geometry as Polygon;
        pointFeatures.forEach((pointFeature) => {
          const point = pointFeature.geometry as Point;
          if (booleanPointInPolygon(point, polygon)) {
            clipps.features.push(pointFeature);
          }
        });
      });
      totalClippedList.set(pointLayer.name, clipps);
    });

    return totalClippedList;
  }

  //Function to avoid duplicates of clipps
  const generateClipName = (name: string) => {
    const suffix = '_clip';
    let uniqueName = name + suffix;
    let count = 2;
    while (geoJSONList.find((layer) => layer.name === uniqueName)) {
      uniqueName = uniqueName + count;
      count++;
    }
    return uniqueName;
  };

  const handleOk = () => {
    setIsLoading(true);
    setTimeout(() => {
      const clipped = handleClip();
      clipped?.forEach((layer: FeatureCollection, name: string) => {
        if (layer.features.length > 0) {
          const newObj: GeoJSONItem = {
            id: generateId(),
            name: generateClipName(name),
            visible: true,
            color: generateDistinctColor(geoJSONList),
            opacity: determineOpacity(layer),
            geoJSON: layer as FeatureCollection,
          };
          setGeoJSONList((prevGeoJSONs: GeoJSONItem[]) => [...prevGeoJSONs, newObj as GeoJSONItem]);
          props.showAlert('success', 'clipped ' + name);
        } else {
          props.showAlert('warning', 'No overlap');
        }
      });
      setIsLoading(false);
      props.handleCloseModal();
    }, 10);
  };

  const handleChoseLayer = (event: ChangeEvent<HTMLInputElement>) => {
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
      setSelectedMainLayer(chosenLayer);
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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flexWrap: 'wrap',
            width: '100%',
          }}
        >
          <Tutorial runTour={runTour} steps={clipSteps} setRunTour={setRunTour} />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography id="clip-header" sx={{ paddingBottom: '10px' }} variant="h6">
              Clipping Tool:
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

          <FormControl>
            <InputLabel id="demo-multiple-chip-label">Select layers:</InputLabel>
            <Select
              style={{ margin: 0 }}
              id="multiple-layer-select"
              label="Select layers"
              multiple
              value={layerNames}
              onChange={handleChange}
              input={<FilledInput id="select-multiple-chip" placeholder="chip" />}
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
          <TextField
            style={{ paddingTop: '10px' }}
            id="select-clip-layer"
            select
            label="Select layer to fit"
            onChange={handleChoseLayer}
            variant="filled"
            defaultValue=""
          >
            {geoJSONList.map((layer) => (
              <MenuItem key={layer.id} value={layer.id}>
                {layer.name}
              </MenuItem>
            ))}
          </TextField>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
              paddingTop: '10px',
            }}
          >
            <Button variant="outlined" color="error" onClick={props.handleCloseModal}>
              Cancel
            </Button>
            <Button id="ok-button" onClick={handleOk} variant="outlined" sx={{ color: '#2975a0' }}>
              {'OK'}
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
}

export default Clip;
