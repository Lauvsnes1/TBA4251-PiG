import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, ThemeProvider } from '@mui/system';
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
import PaletteIcon from '@mui/icons-material/Palette';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { AlertColor } from '@mui/material/Alert';
import Popper from '@mui/material/Popper';
import Fade from '@mui/material/Fade';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';
import Joyride, { StoreHelpers } from 'react-joyride';
import getToolsList from '../data/tools';
import BaseMap from './baseMapMapbox';
import ColorPicker from './colorPicker';
import { AppBar, Main, DrawerHeader, modalStyle } from './styledComponents';
import { useGeoJSONContext, GeoJSONItem } from '../context/geoJSONContext';
import DropDown from './dropDown';
import pac from '../data/pac.jpg';
import { getSteps } from '../data/steps';

import Settings from './settings';
import { makeStyles } from '@mui/styles';

const drawerWidth = 240;

const useStyles = makeStyles({
  hovered: {
    backgroundColor: '#f2f2f2',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
  },
});

export default function MainPage(props: {
  showAlert: (status: AlertColor, message: string) => void;
}) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [openPop, setOpenPop] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [modalComponent, setModalComponent] = useState<JSX.Element>();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedLayer, setSelectedLayer] = useState<GeoJSONItem | null>(null);
  const { geoJSONList, setGeoJSONList } = useGeoJSONContext();
  const [allVisible, setAllVisible] = useState(true);
  const [triggerZoom, setTriggerZoom] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [runTutorial, setRunTutorial] = useState<boolean>(false);
  const joyrideHelpers = useRef<StoreHelpers | null>(null);
  const classes = useStyles();

  const startTutorial = (value: boolean) => {
    setRunTutorial(value);
  };

  const handleJoyrideStepChange = (data: { index: any; type: any }) => {
    const { index, type } = data;
    console.log('index: ', index);
    if (open && index === 2) {
      // If the drawer is already open
      joyrideHelpers.current?.go(3);
    }
  };

  // Add an effect that calls refresh when drawerOpen changes
  useEffect(() => {
    if (open && joyrideHelpers.current) {
      //joyrideHelpers.current.skip();
    }
  }, [open]);

  useEffect(() => {
    console.log('open:', open);
  }, [open]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const toggleVisibility = (layer: GeoJSONItem) => {
    const newObj: GeoJSONItem = { ...layer, visible: !layer.visible };
    setGeoJSONList((prevList) => {
      const index = prevList.findIndex((item) => item.id === layer.id);
      const updatedList = [...prevList]; // create a copy of the original list
      updatedList[index] = newObj; // replace the layer with the new object
      return updatedList;
    });
  };

  const toggleOffAllVisibility = () => {
    setAllVisible(false);
    setGeoJSONList((prevList) => {
      return prevList.map((layer) => {
        // Toggle visibility for each layer
        const newObj = { ...layer, visible: false };
        return newObj;
      });
    });
  };

  const toggleOnAllVisibility = () => {
    setAllVisible(true);
    setGeoJSONList((prevList) => {
      return prevList.map((layer) => {
        // Toggle visibility for each layer
        const newObj = { ...layer, visible: true };
        return newObj;
      });
    });
  };

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

  const closeModal = () => {
    setModal(false);
  };
  const showModal = (id: number) => {
    try {
      const componentToRender: JSX.Element | undefined = tools.find(
        (comp) => comp.id === id
      )?.component;
      setModalComponent(componentToRender);
    } catch {
      console.log('Tool not found');
    }
    setModal(true);
  };
  const passAlert = (status: AlertColor, message: string) => {
    props.showAlert(status, message);
  };

  const zoomToLayer = (layer: GeoJSONItem) => {
    setSelectedLayer(layer);
    setTriggerZoom(!triggerZoom);
  };

  const tools = getToolsList(closeModal, passAlert);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', backgroundColor: '#fafafa' }}>
        <CssBaseline />
        <Joyride
          steps={getSteps}
          run={runTutorial}
          getHelpers={(helpers) => {
            joyrideHelpers.current = helpers;
          }}
          callback={handleJoyrideStepChange}
          continuous
          scrollToFirstStep
          hideCloseButton
          showProgress
          showSkipButton
        />
        <AppBar position="fixed" open={open} sx={{ display: 'flex', backgroundColor: '#2975a0' }}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ diplay: 'flex', alignItems: 'center', flexDirection: 'row' }}>
              <Box id="icon-button">
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  edge="start"
                  sx={{ mr: 2, ...(open && { display: 'none' }) }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Box component="img" sx={{ heigth: 60, width: 60 }} src={pac} />
              <Typography id="qgees" variant="h5" noWrap component="div">
                QGEE's
              </Typography>
            </Box>
            <Box>
              <Settings startTutorial={startTutorial} />
            </Box>
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
          <DrawerHeader style={{ justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ paddingLeft: '10px', fontWeight: 'bold' }}>
              {'Tools '}
            </Typography>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List disablePadding sx={{ paddingTop: 0 }}>
            {tools.map((element, index) => (
              <ListItem key={element.name} id={element.joyride} disablePadding>
                <ListItemButton onClick={() => showModal(element.id)}>
                  <ListItemIcon>
                    <element.icon />
                  </ListItemIcon>
                  <ListItemText primary={element.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography
              variant="h6"
              sx={{
                display: 'flex',
                alignContent: 'flex-start',
                marginLeft: '10px',
                fontWeight: 'bold',
                paddingInline: '8px',
                paddingBottom: '12px',
              }}
            >
              Layers
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', paddingRight: 2 }}>
              {allVisible ? (
                <VisibilityIcon
                  onClick={toggleOffAllVisibility}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className={isHovered ? classes.hovered : ''}
                />
              ) : (
                <VisibilityOffIcon
                  onClick={toggleOnAllVisibility}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className={isHovered ? classes.hovered : ''}
                />
              )}
            </Box>
          </Box>
          <Divider />
          <List disablePadding sx={{ paddingTop: 0 }}>
            {geoJSONList.map((layer) => (
              <div key={layer.id}>
                <Stack spacing={10} direction="row">
                  <ListItem divider key={layer.id} disablePadding sx={{ paddingLeft: '6px' }}>
                    <ListItemButton key={layer.id} sx={{ paddingTop: 0, paddingBottom: 0 }}>
                      <ListItemText>
                        <Typography sx={{ fontSize: 12 }}> {layer.name}</Typography>
                      </ListItemText>
                      <ListItemIcon
                        style={{
                          justifyContent: 'space-between',
                          alignContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <DropDown layer={layer} zoomToLayer={zoomToLayer} />
                        </div>
                        <div onClick={(e) => handleShowColorPicker(e, layer)}>
                          <PaletteIcon htmlColor={layer.color} key={layer.id} />
                        </div>
                        {selectedLayer === layer && (
                          <Popper
                            id={layer.id}
                            open={openPop}
                            anchorEl={anchorEl}
                            transition
                            style={{ zIndex: 2 }}
                          >
                            {({ TransitionProps }) => (
                              <Fade {...TransitionProps} timeout={100}>
                                <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }}>
                                  <ColorPicker
                                    handleCloseColorPicker={handleCloseColorPicker}
                                    layer={layer}
                                  />
                                </Box>
                              </Fade>
                            )}
                          </Popper>
                        )}
                        {layer.visible ? (
                          <VisibilityIcon onClick={() => toggleVisibility(layer)} />
                        ) : (
                          <VisibilityOffIcon onClick={() => toggleVisibility(layer)} />
                        )}
                      </ListItemIcon>
                    </ListItemButton>
                  </ListItem>
                </Stack>
              </div>
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
              <Typography id="modal-modal-title" variant="h6" component="h2"></Typography>
              {modalComponent}
            </Box>
          </Modal>
          <BaseMap layer={selectedLayer} triggerZoom={triggerZoom} showAlert={props.showAlert} />
        </Main>
      </Box>
    </ThemeProvider>
  );
}
