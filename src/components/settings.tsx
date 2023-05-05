import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SettingsIcon from '@mui/icons-material/Settings';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import NavDay from '../data/mapsImg/nav-day.png';
import NavNight from '../data/mapsImg/nav-night.png';
import Light from '../data/mapsImg/light.png';
import Dark from '../data/mapsImg/dark.png';
import Outdoors from '../data/mapsImg/outdoors.png';
import SateliteStreet from '../data/mapsImg/Satelite-street.png';
import Satelite from '../data/mapsImg/satelite.png';
import Streets from '../data/mapsImg/streets.png';
import '../App.css';
import { useGeoJSONContext } from '../context/geoJSONContext';
import { ImageList, ImageListItem, ImageListItemBar, ListSubheader } from '@mui/material';
import { mapModalStyle } from './styledComponents';

const ITEM_HEIGHT = 48;

interface mapOption {
  id: number;
  title: string;
  img: string;
  apiString: string;
}

const useStyles = makeStyles({
  hovered: {
    backgroundColor: '#f2f2f2',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)',
  },
});

export default function Settings() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [editMapModal, setEditMapModal] = useState(false);
  const { setBaseMap } = useGeoJSONContext();
  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const mapOptions: mapOption[] = [
    {
      id: 1,
      title: 'Navigation Day',
      img: NavDay,
      apiString: 'mapbox://styles/mapbox/navigation-day-v1',
    },
    {
      id: 2,
      title: 'Outdoors',
      img: Outdoors,
      apiString: 'mapbox://styles/mapbox/outdoors-v12',
    },

    {
      id: 3,
      title: 'Streets',
      img: Streets,
      apiString: 'mapbox://styles/mapbox/streets-v12',
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
      title: 'Light',
      img: Light,
      apiString: 'mapbox://styles/mapbox/light-v11',
    },
    {
      id: 8,
      title: 'Navigation Night',
      img: NavNight,
      apiString: 'mapbox://styles/mapbox/navigation-night-v1',
    },
  ];

  const handleItemMouseEnter = (id: number) => {
    setHoveredItemId(id);
  };

  const handleItemMouseLeave = () => {
    setHoveredItemId(null);
  };

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
    handleClose();
  };

  const handleShowDeleteModal = () => {
    setEditMapModal(true);
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
        <SettingsIcon sx={{ color: 'white' }} />
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
                <div
                  key={item.id}
                  id={String(item.id)}
                  onClick={() => handleChangeMap(item.apiString)}
                  className={item.id === hoveredItemId ? classes.hovered : ''}
                  onMouseEnter={() => handleItemMouseEnter(item.id)}
                  onMouseLeave={handleItemMouseLeave}
                >
                  <ImageListItem key={item.img} sx={{ margin: 1 }}>
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
          </Box>
        </Modal>
      </Menu>
    </div>
  );
}
