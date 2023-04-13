import { ChangeEvent, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import {
  AlertColor,
  Box,
  Divider,
  Fade,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Popper,
  Typography,
} from '@mui/material';
import { FeatureCollection } from 'geojson';
import { useGeoJSONContext, GeoJSONItem } from '../context/geoJSONContext';
import { uid } from 'uid';
import DeleteIcon from '@mui/icons-material/Delete';
import PaletteIcon from '@mui/icons-material/Palette';
import ColorPicker from './colorPicker';

function FileInput(props: {
  handleCloseModal: () => void;
  showAlert: (status: AlertColor, message: string) => void;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [geoJSONs, setGeoJSONs] = useState<FeatureCollection[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedLayer, setSelectedLayer] = useState<GeoJSONItem | null>(null);
  const [openPop, setOpenPop] = useState<boolean>(false);

  const { geoJSONList, setGeoJSONList } = useGeoJSONContext();

  const handleUploadClick = () => {
    // 👇 We redirect the click event onto the hidden input element
    inputRef.current?.click();
  };
  const handleOk = () => {
    //pass state up to close modal
    props.handleCloseModal();
    //console.log("List after ok press:", files)
    console.log('List of Local GeoJSONS after ok', geoJSONs);
    console.log('List of Global GeoJSONS after ok', geoJSONList);
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    const list = e.target.files;

    const promises = Array.from(list).map((file) => {
      setFiles((prevList) => [...prevList, file as File]);
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const content = JSON.parse(reader.result as string);
            const isGeoJSON = content.type === 'FeatureCollection';
            resolve(isGeoJSON ? content : null);
          } catch (error) {
            reject(error);
          }
        };
        reader.readAsText(file);
      });
    });

    try {
      const files = await Promise.all(promises);
      const geoJSONs = files.filter((file) => file !== null);
      let nameCounter: number = 0;
      geoJSONs.forEach((json) => {
        console.log('Jason:', json, 'type:', typeof json);
        console.log('GLOBAL Before:', geoJSONList);
        //Local
        setGeoJSONs((prevGeoJSONs) => [...prevGeoJSONs, json as FeatureCollection]);
        const name: string = list[nameCounter].name.split('.')[0]; //To remove ".geoJSON"

        const newObj: GeoJSONItem = {
          id: uid(),
          name: name,
          visible: true,
          color: getRandomColor(),
          opacity: 0.5,
          geoJSON: json as FeatureCollection,
        };
        setGeoJSONList((prevGeoJSONs: GeoJSONItem[]) => [...prevGeoJSONs, newObj as GeoJSONItem]);
        nameCounter++;
        props.showAlert('success', 'File uploaded successfully');
      });
    } catch (error) {
      props.showAlert('error', 'error uploading file');
    }
  };

  function getRandomColor(): string {
    const hexChars = '0123456789ABCDEF';
    let hexColor = '#';

    // generate a random hex color code
    for (let i = 0; i < 6; i++) {
      hexColor += hexChars[Math.floor(Math.random() * 16)];
    }

    return hexColor;
  }

  const handleShowColorPicker = (event: React.MouseEvent<HTMLElement>, layer: GeoJSONItem) => {
    setSelectedLayer(layer);
    setAnchorEl(event.currentTarget);
    setOpenPop((previousOpen) => !previousOpen);
  };

  const handleCloseColorPicker = () => {
    setSelectedLayer(null);
    setAnchorEl(null);
    setOpenPop((previousOpen) => !previousOpen);
  };

  const handleDelete = (id: string) => {
    setGeoJSONList((prevList) => {
      const updatedList = prevList.filter((layer) => layer.id !== id);
      return updatedList;
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <Typography variant="h6"> File uploader:</Typography>
      <Button onClick={handleUploadClick}>{'Click to Upload file(s)'}</Button>
      <List dense={true} style={{ width: '100%' }}>
        {geoJSONList.map((file) => {
          return (
            <div
              key={file.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'row',
                width: '100%',
              }}
            >
              <Divider />
              <ListItem divider>
                <ListItemButton>
                  <ListItemText primary={file.name} />
                  <div
                    style={{
                      flexDirection: 'row',
                      display: 'flex',
                      width: '20%',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div onClick={(e) => handleShowColorPicker(e, file)}>
                      <PaletteIcon htmlColor={file.color} key={file.id} />
                    </div>
                    <div onClick={() => handleDelete(file.id)}>
                      <DeleteIcon />
                    </div>
                  </div>
                  {selectedLayer === file && (
                    <Popper
                      id={file.id}
                      open={openPop}
                      anchorEl={anchorEl}
                      transition
                      style={{ zIndex: 2000 }}
                    >
                      {({ TransitionProps }) => (
                        <Fade {...TransitionProps} timeout={100}>
                          <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }}>
                            <ColorPicker
                              handleCloseColorPicker={handleCloseColorPicker}
                              layer={file}
                            />
                          </Box>
                        </Fade>
                      )}
                    </Popper>
                  )}
                </ListItemButton>
              </ListItem>
              <Divider />
            </div>
          );
        })}
      </List>
      <input
        multiple
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <Button onClick={handleOk}>OK</Button>
    </div>
  );
}
export default FileInput;
