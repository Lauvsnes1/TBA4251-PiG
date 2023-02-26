import React, { ElementType, useState,} from 'react';
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
import ScienceIcon from '@mui/icons-material/Science';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import PaletteIcon from '@mui/icons-material/Palette';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Popper from '@mui/material/Popper';
import Fade from '@mui/material/Fade';
import Stack from '@mui/material/Stack';

import StrollyMap from './strollyMap';
import ColorPicker from './colorPicker';
import { AppBar, Main, DrawerHeader } from './styledComponents';

const drawerWidth = 240;

interface Tool {
  name: string;
  icon: ElementType;
}

const tools: Tool[] = [
  {name: "Feature extracor", icon: ScienceIcon },
  {name: "Buffer", icon: RemoveCircleIcon },
  {name: "Intersect", icon: CloseFullscreenIcon }
]


export default function MainPage() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [openPop, setOpenPop] = useState<boolean>(false);

  //Vill måtte brukes som en en property i lista med layers, men nå kun for demo
  const [isVisable, setIsVisable] = useState(true)
  const [color, setColor] = useState("red")
  const [isPicker, setIsPicker] = useState(false)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const setLayerColor = (color: string) => {
    setColor(color)
  }
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  

  const handleVisibility = () => {
    setIsVisable(!isVisable)
  }
  const handleShowColorPicker = (event: React.MouseEvent<HTMLElement>) => {
    setIsPicker(true)
    setAnchorEl(event.currentTarget);
    setOpenPop((previousOpen) => !previousOpen);
  }

  const handleCloseColorPicker = () => {
    setIsPicker(false)
    setOpenPop((previousOpen) => !previousOpen);
    
  };

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
              <ListItemButton>
                <ListItemIcon>
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
          {['Layer1', 'Layer2', 'layer3'].map((text, index) => (
            <Stack spacing={10} direction="row">
            <ListItem key={text} disablePadding >
              <ListItemButton >
                <ListItemText primary={text} />
                <ListItemIcon style={{justifyContent: "space-between", alignContent: "space-between"}}>
                <div onClick={handleShowColorPicker}>
                     <PaletteIcon htmlColor={color} />
                </div>
                  <Popper id={"test"} open={openPop} anchorEl={anchorEl} transition style={{zIndex: 2}}>
                    {({ TransitionProps }) => (
                      <Fade {...TransitionProps} timeout={250}>
                        <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper',  }}>
                          <ColorPicker handleCloseColorPicker={handleCloseColorPicker} setColor={setLayerColor}/>
                          <p>Chosen color is {color}</p>
                        </Box>
                      </Fade>
                    )}
                  </Popper>
                 {isVisable? <VisibilityIcon onClick={handleVisibility} /> : <VisibilityOffIcon onClick={handleVisibility} />} 
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
            </Stack>
          ))}
        </List>
        <DrawerHeader />
      </Drawer> 
      <Main open={open}>
        <StrollyMap/>
      </Main>
    </Box>
  );
}