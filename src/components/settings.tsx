import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import NavDay from '../mapsImg/nav-day.png';
import NavNight from '../mapsImg/nav-night.png';
import Light from '../mapsImg/light.png';
import Dark from '../mapsImg/dark.png';
import Outdoors from '../mapsImg/outdoors.png';
import SateliteStreet from '../mapsImg/Satelite-street.png';
import Satelite from '../mapsImg/satelite.png';
import Streets from '../mapsImg/streets.png';

import { GeoJSONItem, useGeoJSONContext } from '../context/geoJSONContext';
import {
  Button,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  List,
  ListSubheader,
} from '@mui/material';
import { mapModalStyle, modalStyle } from './styledComponents';

const ITEM_HEIGHT = 48;

interface mapOption {
  id: number;
  title: string;
  img: string;
  apiString: string;
}

export default function Settings() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [editModal, setEditModal] = useState(false);
  const [editMapModal, setEditMapModal] = useState(false);
  const { setBaseMap } = useGeoJSONContext();

  const [open, setOpen] = useState(false);

  const mapOptions: mapOption[] = [
    {
      id: 1,
      title: 'Navigation Day',
      img: NavDay,
      apiString: 'mapbox://styles/mapbox/satellite-v9',
    },
    {
      id: 2,
      title: 'Navigation Night',
      img: NavNight,
      apiString: 'mapbox://styles/mapbox/navigation-night-v1',
    },
    {
      id: 3,
      title: 'Light',
      img: Light,
      apiString: 'mapbox://styles/mapbox/light-v11',
    },
    {
      id: 4,
      title: 'Dark',
      img: Dark,
      apiString: 'mapbox://styles/mapbox/dark-v11',
    },
    {
      id: 5,
      title: 'Satelite',
      img: Satelite,
      apiString: 'mapbox://styles/mapbox/satellite-v9',
    },
    {
      id: 6,
      title: 'Satelite Street',
      img: SateliteStreet,
      apiString: 'mapbox://styles/mapbox/satellite-streets-v12',
    },
    {
      id: 7,
      title: 'Streets',
      img: Streets,
      apiString: 'mapbox://styles/mapbox/streets-v12',
    },
    {
      id: 8,
      title: 'Outdoors',
      img: Outdoors,
      apiString: 'mapbox://styles/mapbox/outdoors-v12',
    },
  ];

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };
  const handleChangeMap = (mapAPI: string) => {
    console.log('pressed! with:', mapAPI);
    setBaseMap(mapAPI);
  };

  const handleShowEditModal = () => {
    setEditModal(true);
  };
  const closeEditModal = () => {
    setEditModal(false);
    setOpen(false);
  };
  const handleShowDeleteModal = () => {
    setEditMapModal(true);
  };
  const closeDeleteModal = () => {
    setEditMapModal(false);
    setOpen(false);
  };

  return (
    <div style={{ display: 'contents' }}>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        <MenuItem onClick={handleShowDeleteModal}>{'Edit basemap'}</MenuItem>

        <Modal
          style={{ justifyContent: 'center', alignContent: 'center', display: 'flex' }}
          open={editMapModal}
          onClose={() => setEditMapModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={mapModalStyle}>
            <ImageList sx={{ width: 600, height: 450 }}>
              <ImageListItem
                key="Subheader"
                cols={2}
                sx={{ display: 'flex', justifyContent: 'center' }}
              >
                <ListSubheader component="div" sx={{ fontSize: 20 }}>
                  Select map style:
                </ListSubheader>
              </ImageListItem>
              {mapOptions.map((item) => (
                <div onClick={() => handleChangeMap(item.apiString)}>
                  <ImageListItem key={item.img} sx={{ border: 'dashed', margin: 1 }}>
                    <img
                      src={`${item.img}?w=248&fit=crop&auto=format`}
                      srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                      alt={item.title}
                      loading="lazy"
                    />
                    <ImageListItemBar
                      title={item.title}
                      actionIcon={
                        <IconButton
                          sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                          aria-label={`info about ${item.title}`}
                        ></IconButton>
                      }
                    />
                  </ImageListItem>
                </div>
              ))}
            </ImageList>
            {/* {mapOptions.map((option, index) => (
              <Box
                sx={{
                  display: 'flex',
                  border: 'dashed',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}
              >
                <Typography>{option.name}</Typography>
                <img src={option.photo} />
              </Box>
            ))} */}
          </Box>
        </Modal>
      </Menu>
    </div>
  );
}
