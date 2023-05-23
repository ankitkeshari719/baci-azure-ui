import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import React from 'react';
import { ContainedButton, OutlinedButton } from '../../../components';
import './styles.scss';
import closeImage from '../../../assets/img/Vectorclose.png';
const DialogWithDyanamicData = ({
  open,
  header,
  subtext,
  agreeLabel,
  cancelLabel,
  handleClose,
  acceptClose,
}: {
  open: boolean;
  header: string;
  subtext: string;
  agreeLabel: string;
  cancelLabel: string;
  handleClose: () => void;
  acceptClose:()=>void;
}) => {
  return (
    <Box className="DialogWithDynamicDataContainer">
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"

      >
    
        <img
          src={closeImage}
          onClick={handleClose}
          style={{
            position: 'absolute',
            right: '20px',
            top: '20px',
            cursor: 'pointer',
          }}
        ></img>

        <Box  className='dialogContainer'>
        <DialogTitle
          id="alert-dialog-title"
          color="#EE7538"
          fontSize="24px!important"
          fontFamily="Poppins!important"
        >
          {header}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            fontSize={'20px!important'}
            fontWeight="400"
            color="#343434"
            fontFamily="Poppins!important"
            textAlign="center"
           
          >
            {subtext}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <ContainedButton
            onClick={acceptClose}
            style={{ padding: '12px',  height:'44px', width: "217px" }}
            name={agreeLabel}
            id={agreeLabel}
          />
          {/* autoFocus */}
          <Box component="span" width="10px"/>
          <OutlinedButton
            onClick={handleClose}
            style={{ padding: '12px', height:'44px', width: "217px" }}
            name={cancelLabel}
            id={cancelLabel}
          />
        </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default DialogWithDyanamicData;
