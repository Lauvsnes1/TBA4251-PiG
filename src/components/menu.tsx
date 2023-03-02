// import React, { useState,} from 'react';
// import { styled, useTheme } from '@mui/material/styles';
// import Box from '@mui/material/Box';
// import Drawer from '@mui/material/Drawer';
// import CssBaseline from '@mui/material/CssBaseline';
// import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
// import Toolbar from '@mui/material/Toolbar';
// import List from '@mui/material/List';
// import Typography from '@mui/material/Typography';
// import Divider from '@mui/material/Divider';
// import IconButton from '@mui/material/IconButton';
// import MenuIcon from '@mui/icons-material/Menu';
// import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
// import ChevronRightIcon from '@mui/icons-material/ChevronRight';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import InboxIcon from '@mui/icons-material/MoveToInbox';
// import MailIcon from '@mui/icons-material/Mail';
// import PaletteIcon from '@mui/icons-material/Palette';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
// import Popper from '@mui/material/Popper';
// import Fade from '@mui/material/Fade';
// import Stack from '@mui/material/Stack';

// import StrollyMap from './strollyMap';
// import ColorPicker from './colorPicker';

// const drawerWidth = 240;
// const DrawerHeader = styled('div')(({ theme }) => ({
//     display: 'flex',
//     alignItems: 'center',
//     padding: theme.spacing(0, 1),
//     // necessary for content to be below app bar
//     ...theme.mixins.toolbar,
//     justifyContent: 'flex-end',
//   }));

// export default function Menu() {
//     const theme = useTheme();
//     const [open, setOpen] = React.useState(false);
//     const [openPop, setOpenPop] = useState<boolean>(false);
  
//     //Vill måtte brukes som en en property i lista med layers, men nå kun for demo
//     const [isVisable, setIsVisable] = useState(true)
//     const [color, setColor] = useState("red")
//     const [isPicker, setIsPicker] = useState(false)
//     const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

//     const setLayerColor = (color: string) => {
//         setColor(color)
//       }
//       const handleDrawerOpen = () => {
//         setOpen(true);
//       };
    
//       const handleDrawerClose = () => {
//         setOpen(false);
//       };
      
    
//       const handleVisibility = () => {
//         setIsVisable(!isVisable)
//       }
//       const handleShowColorPicker = (event: React.MouseEvent<HTMLElement>) => {
//         setIsPicker(true)
//         setAnchorEl(event.currentTarget);
//         setOpenPop((previousOpen) => !previousOpen);
//       }
    
//       const handleCloseColorPicker = () => {
//         setIsPicker(false)
//         setOpenPop((previousOpen) => !previousOpen);
        
//       };


//     return (
//             <Drawer
//             sx={{
//                 zIndex: 1,
//                 width: drawerWidth,
//                 flexShrink: 0,
//                 '& .MuiDrawer-paper': {
//                   width: drawerWidth,
//                   boxSizing: 'border-box',
//                 },
                
//               }}
              
//               variant="persistent"
//               anchor="left"
//               open={open}>
//             <DrawerHeader style={{justifyContent: "space-between"}}>
//         <Typography > Tools</Typography>
//           <IconButton onClick={handleDrawerClose}>
//             {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
//           </IconButton>
//         </DrawerHeader>
//         <Divider />
//         <List>
//           {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
//             <ListItem key={text} disablePadding>
//               <ListItemButton>
//                 <ListItemIcon>
//                   {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
//                 </ListItemIcon>
//                 <ListItemText primary={text} />
//               </ListItemButton>
//             </ListItem>
//           ))}
//         </List>
//         <Divider />
//         <Typography>
//           Layers
//         </Typography>
//         <Divider/> 
//         <List>
//           {['Layer1', 'Layer2', 'layer3'].map((text, index) => (
//             <Stack spacing={10} direction="row">
//             <ListItem key={text} disablePadding >
//               <ListItemButton >
//                 <ListItemText primary={text} />
                
//                 <ListItemIcon style={{justifyContent: "space-between", alignContent: "space-between"}}>
//                 <div onClick={handleShowColorPicker}>
                  
//                      <PaletteIcon htmlColor={color} />
//                 </div>
//                   <Popper id={"test"} open={openPop} anchorEl={anchorEl} transition style={{zIndex: 2}}>
//                     {({ TransitionProps }) => (
//                       <Fade {...TransitionProps} timeout={250}>
//                         <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper',  }}>
//                           <ColorPicker handleCloseColorPicker={handleCloseColorPicker} layer={layer}/>
//                           <p>Chosen color is {color}</p>
//                         </Box>
//                       </Fade>
//                     )}
//                   </Popper>
//                  {isVisable? <VisibilityIcon onClick={handleVisibility} /> : <VisibilityOffIcon onClick={handleVisibility} />} 
                 
//                 </ListItemIcon>
                
//               </ListItemButton>
//             </ListItem>
//             </Stack>
//           ))}
//         </List>
//         <DrawerHeader />
//         </Drawer>
            
//     )
// }
export {}