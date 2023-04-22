import React, { useEffect, useRef, useState } from 'react';
import mapboxgl, { CirclePaint, FillPaint, LinePaint } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { useGeoJSONContext, GeoJSONItem } from '../context/geoJSONContext';
import { uid } from 'uid';
import { FeatureCollection } from 'geojson';
import Modal from '@mui/material/Modal';

import { Button, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { modalStyle } from './styledComponents';
import { generateColor } from '../utils/genereateColor';

const accessToken: string | any = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
mapboxgl.accessToken = accessToken;

function BaseMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedLayer, setSelectedLayer] = useState<GeoJSONItem>();
  //const [center, setCenter] = useState<LngLatLike | undefined>([, ])
  const { geoJSONList, setGeoJSONList, baseMap } = useGeoJSONContext();
  const [lng, setLng] = useState(10.421906);
  const [lat, setLat] = useState(63.446827);
  const [zoom, setZoom] = useState(12);
  const [editModal, setEditModal] = useState(false);
  const [name, setName] = useState('');
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [map, setMap] = useState<mapboxgl.Map>();

  const handleShowEditModal = () => {
    setEditModal(true);
  };
  const closeEditModal = () => {
    setEditModal(false);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const fillMap = () => {
    if (!mapContainer.current) {
      return;
    }
    if (map) {
      geoJSONList.forEach((layer) => {
        const { type, paint } = determineType(layer);
        console.log('Sources', map.getStyle().layers);
        if (!map.getSource(layer.id)) {
          map.addSource(layer.id, {
            type: 'geojson',
            data: layer.geoJSON,
          });

          switch (type) {
            case 'fill':
              map.addLayer({
                id: layer.id,
                type: type,
                source: layer.id,
                paint: paint as FillPaint,
              });
              break;
            case 'circle':
              map.addLayer({
                id: layer.id,
                type: type,
                source: layer.id,
                paint: paint as CirclePaint,
              });
              break;
            case 'line':
              map.addLayer({
                id: layer.id,
                type: type,
                source: layer.id,
                paint: paint as LinePaint,
              });
              break;
            default:
              throw new Error(`Unsupported layer type: ${type}`);
          }
        } else {
          const geoJSONSource = map.getSource(layer.id) as mapboxgl.GeoJSONSource;
          geoJSONSource.setData(layer.geoJSON);
          console.log('layer processing:', layer);
          switch (type) {
            case 'fill':
              map.setPaintProperty(layer.id, 'fill-color', layer.color);
              map.setPaintProperty(layer.id, 'fill-opacity', layer.opacity);
              break;
            case 'line':
              map.setPaintProperty(layer.id, 'line-color', layer.color);
              //map.setPaintProperty(layer.id, 'line-opacity', layer.opacity);
              break;
            case 'circle':
              map.setPaintProperty(layer.id, 'circle-color', layer.color);
              //map.setPaintProperty(layer.id, 'circle-opacity', layer.opacity);
              break;
          }
        }
        map.setLayoutProperty(layer.id, 'visibility', determineVisibility(layer));
      });
    }
  };

  const handleEditName = () => {
    if (selectedLayer) {
      const newObj: GeoJSONItem = { ...selectedLayer, name: name };
      setGeoJSONList((prevList) => {
        const index = prevList.findIndex((item) => item.id === selectedLayer?.id);
        const updatedList = [...prevList]; // create a copy of the original list
        updatedList[index] = newObj; // replace the layer with the new object
        return updatedList;
      });
      // Update the map with the new layer name
      if (map) {
        // Check if the layer exists before removing it
        if (map?.getLayer(selectedLayer.name)) {
          map?.removeLayer(selectedLayer.name);
        }
      }
      closeEditModal();
      handleClose();
      setSelectedLayer(undefined);
      setName('');
    }
  };

  const determineType = (layer: GeoJSONItem): { type: string; paint?: mapboxgl.AnyPaint } => {
    const type = layer.geoJSON.features[0].geometry.type;
    switch (type) {
      case 'Point':
        return {
          type: 'circle',
          paint: {
            'circle-radius': 5,
            'circle-color': layer.color,
          },
        };
      case 'LineString':
        return {
          type: 'line',
          paint: {
            'line-color': layer.color,
            'line-width': 2,
          },
        };
      case 'Polygon':
        return {
          type: 'fill',
          paint: { 'fill-color': layer.color, 'fill-opacity': layer.opacity },
        };
      case 'MultiPolygon':
        return {
          type: 'fill',
          paint: { 'fill-color': layer.color, 'fill-opacity': layer.opacity },
        };
      default:
        throw new Error(`Unsupported geometry type: ${type}`);
    }
  };

  const determineVisibility = (layer: GeoJSONItem) => {
    return layer.visible ? 'visible' : 'none';
  };

  const removeLayerAndSource = (layerId: string) => {
    if (!map) {
      return;
    }

    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }

    if (map.getSource(layerId)) {
      map.removeSource(layerId);
    }
  };

  useEffect(() => {
    const attachMap = () => {
      if (!mapContainer.current) {
        return;
      }
      const mapInit = new mapboxgl.Map({
        container: mapContainer.current,
        style: baseMap,
        center: [lng, lat],
        zoom: zoom,
      });

      const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true,
        },
      });

      const createDrawing = () => {
        const data = draw.getAll();
        if (data.features.length > 0) {
          const uniqueName = `costum_${uid()}`;
          const newObj: GeoJSONItem = {
            id: uniqueName,
            name: uniqueName,
            visible: true,
            color: generateColor(),
            opacity: 0.5,
            geoJSON: data as FeatureCollection,
          };
          setGeoJSONList((prevGeoJSONs: GeoJSONItem[]) => [...prevGeoJSONs, newObj as GeoJSONItem]);
          handleShowEditModal();
          setSelectedLayer(newObj);
        }
      };

      mapInit.addControl(draw, 'bottom-left');
      mapInit.on('draw.create', createDrawing);
      //mapInit.on('draw.update', createDrawing);

      setMap(mapInit);
      mapRef.current = mapInit;
    };

    !map && attachMap();
    map && fillMap();
  }, [map, geoJSONList]);

  //update baseMap style
  useEffect(() => {
    if (!mapRef.current) {
      return;
    }
    map?.setStyle(baseMap);
    map?.on('styledata', () => fillMap());
  }, [baseMap]);

  //delete layers
  useEffect(() => {
    const updateLayers = () => {
      const currentLayers = geoJSONList.map((layer) => layer.id);
      console.log('currentLayers', currentLayers);
      // Find the removed layers
      const layersToRemove = map?.getStyle().layers.filter((layer) => {
        const typedLayer = layer as { source?: unknown };
        const source = typedLayer.source as string;
        if (source !== undefined) {
          return !currentLayers.includes(source) && source.startsWith('costum_');
        }
      });

      console.log('Layers to remove', layersToRemove);

      layersToRemove?.forEach((layer) => {
        removeLayerAndSource(layer.id);
        console.log('removed', layer);
      });
    };
    updateLayers();
  }, [geoJSONList]);

  // useEffect(() => {
  //   if (!mapRef.current) {
  //     return;
  //   }

  //   const map = mapRef.current;

  //   const layerIdsToRemove: string[] = [];
  //   const layerNamesToRemove: string[] = [];
  //   const styleLayers = mapRef.current.getStyle().layers || [];

  //   map.on('load', () => {
  //     map.getStyle().layers?.forEach((layer) => {
  //       const layerIndex = geoJSONList.findIndex((geoJSONItem) => geoJSONItem.name === layer.id);
  //       if (layerIndex === -1) {
  //         layerIdsToRemove.push(layer.id as string);
  //         layerNamesToRemove.push(layer.id as string);
  //       }
  //     });
  //   });

  //   if (layerIdsToRemove.length > 0) {
  //     layerIdsToRemove.forEach((layerId, index) => {
  //       const layerName = layerNamesToRemove[index];
  //       map.removeLayer(layerName);
  //       map.removeSource(layerId);
  //     });
  //   }
  // }, [geoJSONList]);

  // useEffect(() => {
  //   if (!mapContainer.current) {
  //     return;
  //   }

  //   const map = new mapboxgl.Map({
  //     container: mapContainer.current,
  //     style: baseMap,
  //     center: [lng, lat],
  //     zoom: zoom,
  //   });

  //   const draw = new MapboxDraw({
  //     displayControlsDefault: false,
  //     // Select which mapbox-gl-draw control buttons to add to the map.
  //     controls: {
  //       polygon: true,
  //       trash: true,
  //     },
  //   });
  //   const createDrawing = () => {
  //     const data = draw.getAll();
  //     if (data.features.length > 0) {
  //       const newObj: GeoJSONItem = {
  //         id: uid(),
  //         name: uid(),
  //         visible: true,
  //         color: generateColor(),
  //         opacity: 0.5,
  //         geoJSON: data as FeatureCollection,
  //       };
  //       setGeoJSONList((prevGeoJSONs: GeoJSONItem[]) => [...prevGeoJSONs, newObj as GeoJSONItem]);
  //       handleShowEditModal();
  //       setSelectedLayer(newObj);
  //     }
  //   };

  //   map.addControl(draw, 'bottom-left');
  //   map.on('draw.create', createDrawing);
  //   map.on('draw.update', createDrawing);

  //   map.on('load', () => {
  //     geoJSONList.forEach((layer) => {
  //       map.addSource(layer.id, {
  //         type: 'geojson',
  //         data: layer.geoJSON,
  //       });

  //       const { type, paint } = determineType(layer);

  //       switch (type) {
  //         case 'fill':
  //           map.addLayer({
  //             id: layer.name,
  //             type: type,
  //             source: layer.id,
  //             paint: paint as FillPaint,
  //           });
  //           break;
  //         case 'circle':
  //           map.addLayer({
  //             id: layer.name,
  //             type: type,
  //             source: layer.id,
  //             paint: paint as CirclePaint,
  //           });
  //           break;
  //         case 'line':
  //           map.addLayer({
  //             id: layer.name,
  //             type: type,
  //             source: layer.id,
  //             paint: paint as LinePaint,
  //           });
  //           break;
  //         default:
  //           throw new Error(`Unsupported layer type: ${type}`);
  //       }
  //       map.setLayoutProperty(layer.name, 'visibility', determineVisibility(layer));
  //     });
  //   });

  //   //to keep persistent position
  //   map.on('move', () => {
  //     setLng(Number(map.getCenter().lng.toFixed(4)));
  //     setLat(Number(map.getCenter().lat.toFixed(4)));
  //     setZoom(Number(map.getZoom().toFixed(2)));
  //   });

  //   return () => {
  //     map.remove();
  //   };

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [geoJSONList, baseMap]);

  return (
    <div>
      <div
        ref={mapContainer}
        className="map-container"
        style={{
          position: 'absolute',
          top: '0',
          bottom: '0',
          width: '100vw',
          height: '100vh',
          border: 3,
          borderRadius: 8,
          borderColor: 'primary.main',
        }}
      />
      <Modal
        open={editModal}
        onClose={() => setEditModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography>Select name for your costum layer:</Typography>
          <TextField
            style={{ paddingTop: '10px' }}
            id="outlined-basic"
            label="Name"
            variant="outlined"
            value={name}
            placeholder={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button style={{ marginTop: '10px' }} variant="outlined" onClick={handleEditName}>
            OK
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default BaseMap;
