import React, { useRef, useState } from 'react';
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
import Joyride, { CallBackProps, StoreHelpers } from 'react-joyride';
import getToolsList from '../data/tools';
import BaseMap from '../components/baseMapMapbox';
import ColorPicker from '../components/colorPicker';
import { AppBar, Main, DrawerHeader, modalStyle } from '../components/styledComponents';
import { useGeoJSONContext, GeoJSONItem } from '../context/geoJSONContext';
import DropDown from '../components/dropDown';
import pac from '../data/pac.jpg';
import { getSteps } from '../tutorial/steps/mainSteps';

import Settings from '../components/settings';
import { makeStyles } from '@mui/styles';

const drawerWidth = 240;

const useStyles = makeStyles({
  hovered: {
    backgroundColor: '#f2f2f2',
    boxShadow: 'inset 0px 0px 8px 0px rgba(0, 0, 0, 0.5);',
    borderRadius: '20px',
  },
});

export default function MainPage(props: {
  showAlert: (status: AlertColor, message: string) => void;
}) {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [openPop, setOpenPop] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [modalComponent, setModalComponent] = useState<JSX.Element>();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedLayer, setSelectedLayer] = useState<GeoJSONItem | null>(null);
  const { geoJSONList, setGeoJSONList } = useGeoJSONContext();
  const [allVisible, setAllVisible] = useState(true);
  const [triggerZoom, setTriggerZoom] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [runTour, setRunTour] = useState<boolean>(false);
  const joyrideHelpers = useRef<StoreHelpers | null>(null);
  const classes = useStyles();

  const handleResetTutorial = () => {
    joyrideHelpers.current?.reset(false);
    setRunTour(true);
  };

  const handleJoyrideStepChange = (data: CallBackProps) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { action, index, status, type } = data;
    if (type === 'tour:end' || type === 'step:close' || action === 'close') {
      joyrideHelpers.current?.close();
      //fix skip step in tutorial problem
      joyrideHelpers.current?.go(index);
      setRunTour(false);
    }
  };

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
      //bit shady but ok for tutorial
      setRunTour(false);
      joyrideHelpers.current?.close();
    } catch (e) {
      console.log('Tool not found, error', e);
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
          run={runTour}
          getHelpers={(helpers) => {
            joyrideHelpers.current = helpers;
          }}
          callback={handleJoyrideStepChange}
          continuous
          showProgress
          showSkipButton
        />

        <AppBar
          id="qgees"
          position="fixed"
          open={open}
          sx={{ display: 'flex', backgroundColor: '#2975a0' }}
        >
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
              <Typography variant="h5" noWrap component="div">
                QGEE'S
              </Typography>
            </Box>
            <Box>
              <Settings setRunTour={setRunTour} resetTutorial={handleResetTutorial} />
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
            overflow: 'auto',
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
          <List id="layer-list" disablePadding sx={{ paddingTop: 0 }}>
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
                        <div id="drop-down-menu">
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
