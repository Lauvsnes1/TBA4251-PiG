import React, { ElementType, useState, useContext} from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ScienceIcon from '@mui/icons-material/Science';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import PaletteIcon from '@mui/icons-material/Palette';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Popper from '@mui/material/Popper';
import Fade from '@mui/material/Fade';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import StrollyMap from './strollyMap';
import ColorPicker from './colorPicker';
import FileInput from './fileInput';
import { AppBar, Main, DrawerHeader, modalStyle } from './styledComponents';
import { useGeoJSONContext, GeoJSONItem } from '../context/geoJSONContext';
import DropDown from "./dropDown"
import { FeatureCollection } from 'geojson';

const drawerWidth = 240;

interface Tool {
  name: string;
  icon: ElementType;
  handler: () => void;
}



export default function MainPage() {
  const theme = useTheme();
  //const myContext = useContext(MyContext)
  const [open, setOpen] = React.useState(false);
  const [openPop, setOpenPop] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [openDropDown, setOpenDropDown] = useState<boolean>(false);

  //Vill måtte brukes som en en property i lista med layers, men nå kun for demo
  const [color, setColor] = useState("red")
  const [isPicker, setIsPicker] = useState(false)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  //const [geoJSONList, setGeoJSONList] = useState<GeoJSONListState[]>([]);

  const { geoJSONList, setGeoJSONList, setVisable } = useGeoJSONContext(); 


const tools: Tool[] = [
  {name: "Load data", icon: FileUploadIcon, handler: () => showModal()}, 
  {name: "Feature extracor", icon: ScienceIcon, handler: () => showModal()},
  {name: "Buffer", icon: RemoveCircleIcon, handler:() => showModal() },
  {name: "Intersect", icon: CloseFullscreenIcon, handler: () => showModal() }
]

  const setLayerColor = (color: string) => {
    setColor(color)
  }
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  
  const toggleVisibility = (layer: GeoJSONItem) => {
    const newObj: GeoJSONItem = { ...layer, visable: !layer.visable };
    setGeoJSONList(prevList => {
      const index = prevList.findIndex(item => item.id === layer.id);
      const updatedList = [...prevList]; // create a copy of the original list
      updatedList[index] = newObj; // replace the layer with the new object
      return updatedList;
    });
  };

  const handleShowEdit = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpenDropDown((previousOpenDropDown) => !previousOpenDropDown)


  }

  const handleShowColorPicker = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpenPop((previousOpen) => !previousOpen);
  }

  const handleCloseColorPicker = () => {
    setOpenPop((previousOpen) => !previousOpen);
    
  };

  const showModal = () => {
    setModal(true)
    
  }
  const closeModal = () => {
    setModal(false)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Gis-App
          </Typography>
        </Toolbar>
      </AppBar>
       <Drawer
        sx={{
          zIndex: 1,
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}      
        variant="persistent"
        anchor="left"
        open={open}        
      >
        <DrawerHeader style={{justifyContent: "space-between"}}>
        <Typography > Tools</Typography>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {tools.map((element, index) => (
            <ListItem key={element.name} disablePadding>
              <ListItemButton onClick={element.handler}>
                <ListItemIcon >
                  <element.icon/>
                </ListItemIcon>
                <ListItemText primary={element.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Typography>
          Layers
        </Typography>
        <Divider/> 
        <List>
          {geoJSONList.map((layer) => (
            <Stack spacing={10} direction="row">
            <ListItem key={layer.id} disablePadding >
              <ListItemButton >
                <ListItemText primary={layer.name}  />
                <ListItemIcon style={{justifyContent: "space-between", alignContent: "space-between", alignItems: "center"}}>
                  {/* <div onClick={handleShowEdit}> */}
                  <div>
                  <DropDown layer={layer}/>
                  </div>
                  {/*<Popper id={"test"} open={openDropDown} anchorEl={anchorEl} transition style={{zIndex: 2}}>
                  {({ TransitionProps }) => (
                      <Fade {...TransitionProps} timeout={100}>
                  <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper',  }}>
                    <DropDown/>
                  </Box>
                  </Fade>
                    )}
                  </Popper>*/}
                <div onClick={handleShowColorPicker}>
                     <PaletteIcon htmlColor={layer.color} />
                </div>
                  <Popper id={"test"} open={openPop} anchorEl={anchorEl} transition style={{zIndex: 2}}>
                    {({ TransitionProps }) => (
                      <Fade {...TransitionProps} timeout={100}>
                        
                        <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper'  }}>
                          <ColorPicker handleCloseColorPicker={handleCloseColorPicker} setColor={setLayerColor}/>
                          <p>Chosen color is {layer.color}</p>
                        </Box>
      
                      </Fade>
                    )}
                  </Popper>
                 {layer.visable? <VisibilityIcon onClick={() => toggleVisibility(layer)} /> : <VisibilityOffIcon onClick={() => toggleVisibility(layer)} />} 
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
            </Stack>
          ))}
        </List>
        <DrawerHeader />
      </Drawer> 
      <Main open={open}>
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
          </Typography>
          <FileInput handleCloseModal={closeModal} />
        </Box>
      </Modal>
        <StrollyMap/>
      </Main>
    </Box>
  );
}

