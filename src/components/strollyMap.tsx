import React, { useEffect, useRef, useState } from 'react';
import mapboxgl, { CirclePaint, FillPaint, LinePaint } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { useGeoJSONContext, GeoJSONItem } from '../context/geoJSONContext';
import { uid } from 'uid';
import { FeatureCollection } from 'geojson';
import Modal from '@mui/material/Modal';

import { Button, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { modalStyle } from './styledComponents';

const accessToken: string | any = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
mapboxgl.accessToken = accessToken;

function StrollyMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedLayer, setSelectedLayer] = useState<GeoJSONItem>();
  //const [center, setCenter] = useState<LngLatLike | undefined>([, ])
  const { geoJSONList, setGeoJSONList } = useGeoJSONContext();
  const [lng, setLng] = useState(10.421906);
  const [lat, setLat] = useState(63.446827);
  const [zoom, setZoom] = useState(12);
  const [editModal, setEditModal] = useState(false)
  const [name, setName] = useState("")

  const handleShowEditModal = () => {
    setEditModal(true)
  }
  const closeEditModal = () => {
    setEditModal(false)
  }
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleEditName = () => {
    if(selectedLayer){
    const newObj: GeoJSONItem = {...selectedLayer, name: name}
    setGeoJSONList(prevList => {
      const index = prevList.findIndex(item => item.id === selectedLayer?.id);
      const updatedList = [...prevList]; // create a copy of the original list
      updatedList[index] = newObj; // replace the layer with the new object
      return updatedList;
    })
    closeEditModal()
    handleClose()
    setSelectedLayer(undefined)
    setName("");
  }
 
  }
  
  function getRandomColor(): string {
    const hexChars = '0123456789ABCDEF';
    let hexColor = '#';

    // generate a random hex color code
    for (let i = 0; i < 6; i++) {
      hexColor += hexChars[Math.floor(Math.random() * 16)];
    }

    return hexColor;
  }
 
  const determineType = (layer: GeoJSONItem): { type: string, paint?: mapboxgl.AnyPaint } => {
    const type = layer.geoJSON.features[0].geometry.type;
    switch (type) {
      case "Point":
        return {
          type: "circle",
          paint: {
            "circle-radius": 5,
            "circle-color": layer.color,
          },
        };
      case "LineString":
        return {
          type: "line",
          paint: {
            'line-color': layer.color,
            'line-width': 2,
          }
        };
      case "Polygon":
        return {
          type: "fill",
          paint: { 'fill-color': layer.color, 'fill-opacity': 0.5 }
        };
      default:
        throw new Error(`Unsupported geometry type: ${type}`);
    }
  };

  const determineVisibility = (layer: GeoJSONItem) => {
    return layer.visible ? 'visible' : 'none';
  }

  useEffect(() => {
    if (!mapContainer.current) {
      return;
    }

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [lng, lat],
      zoom: zoom
    });

    //Fix the gap
    var canvas = map.getCanvas()
    canvas.style.position = 'fixed';

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      // Select which mapbox-gl-draw control buttons to add to the map.
      controls: {
      polygon: true,
      trash: true
      },
      });
      const createDrawing = () => {
        const data = draw.getAll();
        if(data.features.length > 0){
          const newObj: GeoJSONItem = {
            id: uid(),
            name: uid(),
            visible: true,
            color: getRandomColor(),
            geoJSON: data as FeatureCollection
          };
          setGeoJSONList((prevGeoJSONs: GeoJSONItem[]) => [...prevGeoJSONs, newObj as GeoJSONItem]);
          handleShowEditModal()
          setSelectedLayer(newObj)
        }
        
      }

    map.addControl(draw, "bottom-left");
    map.on('draw.create', createDrawing);
    map.on('draw.update', createDrawing);
    


    map.on('load', () => {
      for (const layer of geoJSONList) {
        map.addSource(layer.id, {
          type: 'geojson',
          data: layer.geoJSON,
        });

        const { type, paint } = determineType(layer);

        switch (type) {
          case 'fill':
            map.addLayer({
              id: layer.name,
              type: type,
              source: layer.id,
              paint: paint as FillPaint,
            });
            break;
          case 'circle':
            map.addLayer({
              id: layer.name,
              type: type,
              source: layer.id,
              paint: paint as CirclePaint,
            });
            break;
          case 'line':
            map.addLayer({
              id: layer.name,
              type: type,
              source: layer.id,
              paint: paint as LinePaint,
            });
            break;
          default:
            throw new Error(`Unsupported layer type: ${type}`);
        }

        map.setLayoutProperty(layer.name, 'visibility', determineVisibility(layer));
      }
    });

    //to keep persistent position
    map.on('move', () => {
      setLng(Number(map.getCenter().lng.toFixed(4)));
      setLat(Number(map.getCenter().lat.toFixed(4)));
      setZoom(Number(map.getZoom().toFixed(2)));

    });

    return () => {
      map.remove();

    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geoJSONList]);

  return (
    <div style={{position: 'fixed'}}>
    <div
      ref={mapContainer}
      className="map-container"
      style={{
        position: 'fixed',
        top: '0',
        bottom: '0',
        width: '100vw',
        height: '100vh',
        border: 3,
        borderRadius: 8,
        borderColor: 'primary.main'
      }}
    />
    <Modal
    open={editModal}
    onClose={() => setEditModal(false)}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Box sx={modalStyle} >
      <Typography>Select name for your costum layer:</Typography>
    <TextField style={{paddingTop: '10px'}}id="outlined-basic" label="Name" variant="outlined" value={name} placeholder={name} onChange={(e) => setName(e.target.value)}/>
    <Button style={{paddingTop: '10px'}}variant='outlined' onClick={handleEditName}>
      OK
    </Button>
    </Box>
  </Modal>
  </div>
  );
}

export default StrollyMap;
