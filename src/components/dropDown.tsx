import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import { GeoJSONItem, useGeoJSONContext} from '../context/geoJSONContext';
import { Layer } from 'react-map-gl';
import { Button } from '@mui/material';
import { modalStyle } from './styledComponents';
import { close } from 'inspector';

const ITEM_HEIGHT = 48;

export default function LongMenu(props: {layer: GeoJSONItem}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [editModal, setEditModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [name, setName] = useState('')
  const { setGeoJSONList } = useGeoJSONContext(); 

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleShowEditModal = () => {
    setEditModal(true)
  }
  const closeEditModal = () => {
    setEditModal(false)
  }
  const handleShowDeleteModal = () => {
    setDeleteModal(true)
  }
  const closeDeleteModal = () => {
    setDeleteModal(false)
  }

  const handleEditName = () => {
    const newObj: GeoJSONItem = { ...props.layer, name: name };
    setGeoJSONList(prevList => {
      const index = prevList.findIndex(item => item.id === props.layer.id);
      const updatedList = [...prevList]; // create a copy of the original list
      updatedList[index] = newObj; // replace the layer with the new object
      return updatedList;
    })
    closeEditModal()
    handleClose()

  }

  const handleDelete = () => {
    setGeoJSONList(prevList => {
      const updatedList = prevList.filter(layer => layer.id !== props.layer.id);
      return updatedList;
    });
    closeDeleteModal()
    handleClose()
  }


  
  const toggleVisibility = (layer: GeoJSONItem) => {
    const newObj: GeoJSONItem = { ...layer, visable: !layer.visable };
    setGeoJSONList(prevList => {
      const index = prevList.findIndex(item => item.id === layer.id);
      const updatedList = [...prevList]; // create a copy of the original list
      updatedList[index] = newObj; // replace the layer with the new object
      return updatedList;
    });
  };

  return (
    <div style={{ display: "contents"}}>
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
          <MenuItem  onClick={handleShowEditModal} >
            {"Edit name"}
          </MenuItem>
          <MenuItem onClick={handleShowDeleteModal}>
          {"Delete"}
          </MenuItem>

          <Modal
        open={editModal}
        onClose={() => setEditModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle} >
        <TextField id="outlined-basic" label="New Name" variant="outlined" value={name} placeholder={props.layer.name} onChange={(e) => setName(e.target.value)}/>
        <Button variant='outlined' onClick={handleEditName}>
          OK
        </Button>
        </Box>
      </Modal>

      <Modal style={{justifyContent: "center", alignContent: "center", display: 'flex'}}
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle} >
      <Typography>Are You sure you want to delete?</Typography>
        <Button onClick={handleDelete} variant="outlined" color="error">
          Delete
        </Button>
        </Box>
      </Modal>
      
      </Menu>
    </div>
  );
}