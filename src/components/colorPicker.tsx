import React, { useState } from 'react';
import { CompactPicker } from 'react-color';
import Button from '@mui/material/Button';
import { GeoJSONItem, useGeoJSONContext} from '../context/geoJSONContext';


function ColorPicker(props: { handleCloseColorPicker: () => void; layer: GeoJSONItem}) {
    const [color, setColor] = useState<any | string>(props.layer.color);
    const { setGeoJSONList, geoJSONList } = useGeoJSONContext(); 

    const handleColorChange = (color: string) => {
      setColor(color)
    }

    

    const handleClose = () => {
      const newObj: GeoJSONItem = { ...props.layer, color: color };
      setGeoJSONList(prevList => {
        const index = prevList.findIndex(item => item.id === props.layer.id);
        const updatedList = [...prevList]; // create a copy of the original list
        updatedList[index] = newObj; // replace the layer with the new object
        return updatedList;
      })
      props.handleCloseColorPicker()
    }

    return(
        
        <div className="sketchpicker" style={{display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center"}}>
          <div
            style={{
              backgroundColor: color,
              width: 240,
              height: 50,
              border: "2px solid white",
            }}
          ></div>
          {/* Compact picker from react-color and handling color on onChange event */}
          <CompactPicker
          onChange={(target) => handleColorChange(target.hex)}
          color={color}
          />
          <Button style={{marginTop: "5px"}} variant="outlined" onClick={handleClose}>Ok</Button>
        </div>

    );



}
export default ColorPicker