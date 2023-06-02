/* eslint-disable react-hooks/exhaustive-deps */
import { ChangeEvent, useEffect, useRef, useState } from 'react';
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
import DeleteIcon from '@mui/icons-material/Delete';
import PaletteIcon from '@mui/icons-material/Palette';
import booleanEqual from '@turf/boolean-equal';
import ColorPicker from './colorPicker';
import { generateDistinctColor } from '../utils/genereateColor';
import generateId from '../utils/generateId';
import determineOpacity from '../utils/determineOpacity';

function FileInput(props: {
  handleCloseModal: () => void;
  showAlert: (status: AlertColor, message: string) => void;
}) {
  const [toDisplay, setToDisplay] = useState<FeatureCollection[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedLayer, setSelectedLayer] = useState<GeoJSONItem | null>(null);
  const [openPop, setOpenPop] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileList>();

  const { geoJSONList, setGeoJSONList } = useGeoJSONContext();

  const handleUploadClick = () => {
    // 👇 We redirect the click event onto the hidden input element
    inputRef.current?.click();
  };
  const handleOk = () => {
    //pass state up to close modal
    props.handleCloseModal();
  };

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    //Check that every file type is a geoJSON/json
    const files = e.target.files;
    console.log(files);
    let isJsons = true;
    if (files) {
      Array.from(files).forEach((file) => {
        if (file.type !== 'application/json' && file.type !== 'application/geojson') {
          //isJsons = false;
        }
      });
      if (isJsons) {
        setUploadedFiles(files);
      } else {
        props.showAlert('error', 'Unsupported file type');
      }
    }
  };

  useEffect(() => {
    if (!uploadedFiles) {
      return;
    }
    const upload = async () => {
      const promises = Array.from(uploadedFiles).map((file) => {
        //Promise has resolve reject to handle succes and fail
        return new Promise((resolve, reject) => {
          //create reader instance to read file
          const reader = new FileReader();
          reader.onload = () => {
            try {
              //we parse the result on string format
              const content = JSON.parse(reader.result as string);
              const isGeoJSON = content.type === 'FeatureCollection';
              resolve(isGeoJSON ? content : null);
            } catch (error) {
              reject(error);
              props.showAlert('error', 'Unsupported file type');
              return;
            }
          };
          reader.readAsText(file);
        });
      });

      try {
        const files = await Promise.all(promises);
        //remove all instances of null
        const geoJSONs = files.filter((file) => file !== null);
        let nameCounter: number = 0;
        //we create one new GeoJSONItem for each uploaded file
        const newGeoJSONItems: GeoJSONItem[] = [];
        geoJSONs.forEach((json) => {
          setToDisplay((prevGeoJSONs) => [...prevGeoJSONs, json as FeatureCollection]); //Local list of geoJSONs
          const name: string = uploadedFiles[nameCounter].name.split('.')[0];
          const newObj: GeoJSONItem = {
            id: generateId(),
            name: name,
            visible: true,
            color: generateDistinctColor([...geoJSONList, ...newGeoJSONItems]),
            opacity: determineOpacity(json as FeatureCollection),
            geoJSON: json as FeatureCollection,
          };
          newGeoJSONItems.push(newObj as GeoJSONItem);
          nameCounter++;
          props.showAlert('success', 'File uploaded successfully');
        });

        // Now, add all the new items global state at once
        setGeoJSONList((prevGeoJSONs: GeoJSONItem[]) => [...prevGeoJSONs, ...newGeoJSONItems]);
      } catch (error) {
        console.log(error);
        props.showAlert('error', 'error uploading file');
      }
    };
    upload();
  }, [uploadedFiles]);

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

  const filesToDisplay = (layer: GeoJSONItem) => {
    //To check which files to display in the modal
    //A bit cheating as it only checks the first geometry to be equal
    //return geoJSONList.find((GeoJSON) => layer.id === GeoJSON.id);
    return toDisplay.find((geoJSON) =>
      booleanEqual(geoJSON.features[0], layer.geoJSON.features[0])
    );
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
      <Button
        sx={{ marginTop: 1 }}
        variant="contained"
        style={{ backgroundColor: '#2975a0' }}
        onClick={handleUploadClick}
      >
        {'Click to Upload file(s)'}
      </Button>
      <List dense={true} style={{ width: '100%' }}>
        {geoJSONList.map((file) => {
          if (filesToDisplay(file)) {
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
                            <Box sx={{ border: 1, p: 1, bgcolor: '#e1ecf2' }}>
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
          }
        })}
      </List>
      <input
        multiple
        type="file"
        ref={inputRef}
        onChange={handleUpload}
        style={{ display: 'none' }}
      />
      <Button sx={{ color: '#2975a0' }} onClick={handleOk}>
        Submit
      </Button>
    </div>
  );
}
export default FileInput;
