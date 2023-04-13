import React, { useState } from 'react';
import { CompactPicker } from 'react-color';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { GeoJSONItem, useGeoJSONContext } from '../context/geoJSONContext';
import { Typography } from '@mui/material';

function ColorPicker(props: { handleCloseColorPicker: () => void; layer: GeoJSONItem }) {
  const [color, setColor] = useState<any | string>(props.layer.color);
  const [opacity, setOpacity] = useState<number>(props.layer.opacity);
  const { setGeoJSONList } = useGeoJSONContext();

  const handleColorChange = (color: string) => {
    setColor(color);
  };

  const handleClose = () => {
    const newObj: GeoJSONItem = { ...props.layer, color: color, opacity: opacity };
    setGeoJSONList((prevList) => {
      const index = prevList.findIndex((item) => item.id === props.layer.id);
      const updatedList = [...prevList]; // create a copy of the original list
      updatedList[index] = newObj; // replace the layer with the new object
      return updatedList;
    });
    props.handleCloseColorPicker();
  };
  const handleOpacity = (event: Event, newValue: number | number[]) => {
    setOpacity(newValue as number);
  };

  return (
    <Box
      className="sketchpicker"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography>Color: </Typography>
      <div
        style={{
          backgroundColor: color,
          width: 240,
          height: 50,
          border: '2px solid white',
        }}
      ></div>
      {/* Compact picker from react-color and handling color on onChange event */}
      <CompactPicker onChange={(target) => handleColorChange(target.hex)} color={color} />
      <Box
        sx={{
          width: 300,
          paddingTop: '10px',
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography>Opacity:</Typography>
        <Slider
          aria-label="Opacity"
          defaultValue={props.layer.opacity}
          valueLabelDisplay="auto"
          step={0.1}
          marks
          min={0}
          max={1}
          onChange={handleOpacity}
        />
      </Box>
      <Button style={{ marginTop: '5px' }} variant="outlined" onClick={handleClose}>
        Ok
      </Button>
    </Box>
  );
}
export default ColorPicker;
