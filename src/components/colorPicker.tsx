import React, { useState } from 'react';
import { CompactPicker } from 'react-color';
import Button from '@mui/material/Button';

function ColorPicker(props: { handleCloseColorPicker: () => void; setColor: (chosen: string) => void}) {
    const [color, setColor] = useState<any | string>('#333');
    

    const handleClose = () => {
      props.handleCloseColorPicker()
    }

    const passColor = (chosen: string) => {
      setColor(chosen)
      props.setColor(chosen)

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
          onChange={(target) => passColor(target.hex)}
          color={color}
          />
          <Button style={{marginTop: "5px"}} variant="outlined" onClick={handleClose}>Ok</Button>
        </div>

    );



}
export default ColorPicker