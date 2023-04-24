import React, { useEffect, useRef, useState } from 'react';
import mapboxgl, { CirclePaint, FillPaint, LinePaint, LngLatLike } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { useGeoJSONContext, GeoJSONItem } from '../context/geoJSONContext';
import { FeatureCollection } from 'geojson';
import Modal from '@mui/material/Modal';
import { Button, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { modalStyle } from './styledComponents';
import { generateColor } from '../utils/genereateColor';
import generateId from '../utils/generateId';
import center from '@turf/center';
import { AllGeoJSON } from '@turf/helpers';

const accessToken: string | any = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
mapboxgl.accessToken = accessToken;

function BaseMap(props: { triggerZoom: boolean; layer: GeoJSONItem | null }) {
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

  const openEditModal = () => {
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
        console.log('layer', layer);
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
          map.once('sourcedata', () => {
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
          });
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
      closeEditModal();
      handleClose();
      setSelectedLayer(undefined);
      setName('');
    }
  };

  const determineType = (
    layer: GeoJSONItem
  ): { type: 'fill' | 'circle' | 'line'; paint?: mapboxgl.AnyPaint } => {
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

  const createDrawing = (draw: MapboxDraw) => {
    const data = draw.getAll();
    if (data.features.length > 0) {
      const uniqueName = generateId();
      const newObj: GeoJSONItem = {
        id: uniqueName,
        name: uniqueName,
        visible: true,
        color: generateColor(),
        opacity: 0.5,
        geoJSON: data as FeatureCollection,
      };
      map?.addSource(newObj.id, {
        type: 'geojson',
        data: newObj.geoJSON,
      });
      map?.addLayer({
        id: newObj.id,
        type: 'fill',
        source: newObj.id,
        paint: { 'fill-color': newObj.color, 'fill-opacity': newObj.opacity } as FillPaint,
      });
      setGeoJSONList((prevGeoJSONs: GeoJSONItem[]) => [...prevGeoJSONs, newObj as GeoJSONItem]);
      draw.deleteAll();
      setTimeout(() => {
        openEditModal();
        setSelectedLayer(newObj);
      }, 100);
    }
  };

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

    mapInit.addControl(draw, 'bottom-left');
    mapInit.on('draw.create', () => createDrawing(draw));
    mapInit.on('draw.update', () => createDrawing(draw));

    setMap(mapInit);
    mapRef.current = mapInit;
  };
  const removeLayers = () => {
    const currentLayers = geoJSONList.map((layer) => layer.id);

    // Find the removed layers which exist on map but not in global list
    const layersToRemove = map?.getStyle().layers.filter((layer) => {
      const typedLayer = layer as { source?: unknown };
      const source = typedLayer.source as string;
      if (source !== undefined) {
        //custom prefix separates the layers from mapbox predefined layers
        return !currentLayers.includes(source) && source.startsWith('custom_');
      }
    });

    layersToRemove?.forEach((layer) => {
      removeLayerAndSource(layer.id);
      console.log('removed', layer);
    });
  };
  const zoomToLayer = (layer: any) => {
    if (map) {
      map.flyTo(layer);
    }
  };
  useEffect(() => {
    console.log('Kjører useEffect');
    if (props.layer) {
      const centeroid = center(props.layer?.geoJSON as AllGeoJSON);
      const shift: number = -0.025; //To compensate for drawer on the left
      if (centeroid) {
        map?.flyTo({
          center: [centeroid.geometry.coordinates[0] - shift, centeroid.geometry.coordinates[1]],
          essential: true,
          zoom: 12,
          speed: 0.8,
          curve: 1,
        });
      }
    }
  }, [props.triggerZoom]);

  useEffect(() => {
    !map && attachMap();
    // map && fillMap();
  }, []);

  useEffect(() => {
    map && fillMap();
  }, [geoJSONList]);

  //update baseMap style
  useEffect(() => {
    if (!mapRef.current) {
      return;
    }
    map?.setStyle(baseMap);
    //fill map once after style is changed
    map?.once('styledata', () => fillMap());
  }, [baseMap]);

  //delete layers
  useEffect(() => {
    removeLayers();
  }, [geoJSONList]);

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
